import { env } from "@/env";
import { db } from "@/server/db";
import { usersTable } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { checkPasswordComplexity } from "@/utils/password-complexity";
import { z } from "zod";
import type { ReturnTuple } from "@/utils/type-utils";
import nodemailer from "nodemailer";

const schema = z
  .object({
    name: z.string(),
    email: z.string().email(),
    username: z.string(),
    password: z.string(),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords don't match",
      });
      return false;
    }
    if (!checkPasswordComplexity(data.password)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password is too weak",
      });
      return false;
    }
    return data;
  });

export async function POST(req: Request) {
  // if (!env.NEXT_PUBLIC_VERCEL)
  //   return new Response("Not Available", { status: 404 });

  if (
    !env.NODE_MAILER_USERNAME ||
    !env.NODE_MAILER_PASSWORD ||
    !env.NODE_MAILER_SERVICE
  )
    return new Response("Not Available", { status: 404 });

  if (req.method !== "POST")
    return new Response("Method not allowed", { status: 405 });

  try {
    const formData = (await req.json()) as z.infer<typeof schema>;
    const parseResult = await schema.safeParseAsync(formData);
    if (!parseResult.success) {
      console.log(parseResult.error);
      return new Response("Invalid data", { status: 400 });
    }

    const { email, username } = parseResult.data;

    const [usernameExists, usernameExistsError] =
      await checkUsernameExists(username);
    if (usernameExistsError !== null)
      return new Response(usernameExistsError, { status: 400 });
    if (usernameExists)
      return new Response("Username already exists", { status: 400 });

    const [emailExists, emailExistsError] = await checkEmailExists(email);
    if (emailExistsError !== null)
      return new Response(emailExistsError, { status: 400 });
    if (emailExists)
      return new Response("Email already exists", { status: 400 });

    sendEmail(parseResult.data);
  } catch (error) {
    console.log(error);
    return new Response("Invalid data", { status: 400 });
  }
  return new Response("ok");
}

async function checkUsernameExists(
  username: string,
): Promise<ReturnTuple<boolean>> {
  try {
    const exists = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, username));

    if (exists.length > 0) return [true, null];

    return [false, null];
  } catch (error) {
    console.log(error);
    return [null, "Error checking username"];
  }
}

async function checkEmailExists(email: string): Promise<ReturnTuple<boolean>> {
  try {
    const exists = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (exists.length > 0) return [true, null];

    return [false, null];
  } catch (error) {
    console.log(error);
    return [null, "Error checking email"];
  }
}

function sendEmail(data: z.infer<typeof schema>) {
  const { email, username, name } = data;
  const transporter = nodemailer.createTransport({
    service: env.NODE_MAILER_SERVICE,
    auth: {
      user: env.NODE_MAILER_USERNAME,
      pass: env.NODE_MAILER_PASSWORD,
    },
  });

  const mailOptions = {
    from: "Daftar",
    to: "seifmegahed@me.com",
    subject: "Welcome to Daftar Demo",
    html: `
    <h1>Hello ${name},</h1>
    <br/>
    <h1>Welcome to Daftar Demo</h1>
    <br/>
    <p>Your username is ${username}, and your email is ${email}</p>
    <br/>
    <p>Thank you for signing up, Feel free to explore the app.</p>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}
