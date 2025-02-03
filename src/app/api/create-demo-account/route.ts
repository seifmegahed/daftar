import { env } from "@/env";
import { db } from "@/server/db";
import { usersTable } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { checkPasswordComplexity } from "@/utils/password-complexity";
import { z } from "zod";
import type { ReturnTuple } from "@/utils/type-utils";
import nodemailer from "nodemailer";
import { createUserRequestAction } from "@/server/actions/user-requests/create";

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

    const [confirmationCode, confirmationCodeError] =
      await createUserRequestAction(parseResult.data);

    if (confirmationCodeError !== null)
      return new Response(confirmationCodeError, { status: 400 });

    const [result, error] = await sendEmail(parseResult.data, confirmationCode);
    if (result === null) return new Response(error, { status: 400 });

    return new Response("ok");
  } catch (error) {
    console.log(error);
    return new Response("Invalid data", { status: 400 });
  }
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

async function sendEmail(
  data: z.infer<typeof schema>,
  confirmationCode: string,
): Promise<ReturnTuple<boolean>> {
  const { name, email } = data;
  const transporter = nodemailer.createTransport({
    service: env.NODE_MAILER_SERVICE,
    auth: {
      user: env.NODE_MAILER_USERNAME,
      pass: env.NODE_MAILER_PASSWORD,
    },
  });

  const mailOptions = {
    from: "Daftar",
    to: email,
    subject: "Welcome to Daftar Demo",
    html: `
    <h1>Hello ${name},</h1>
    <h3>Welcome to Daftar Demo</h3>
    <br/>
    <p>Please click on the button below to verify you Email.</p>
    <br/>
    <button><a class="button-href" target="_blank" href="${env.SSL ? "https" : "http"}://${env.NEXT_PUBLIC_VERCEL ? "daftar-demo.vercel.app" : "localhost:3000"}/verify/${confirmationCode}">Verify Email</a></button>
    <br/>
    <p>Thank you for signing up, Feel free to explore the app.</p>
    <br/>
    <p>Kind Regards,</p>
    <p>Seif Megahed</p>
    <a href="mailto:seifmegahed@me.com">seifmegahed@me.com</a>
    <style>
      .button-href {
        text-decoration: none;
        color: white;
      }
      button {
        background-color: #007bff;
        border: none;
        color: white;
        padding: 10px 20px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        margin: 4px 2px;
        cursor: pointer;
        border-radius: 5px;
      }
      button:hover {
        background-color: #0056b3;
      }
    </style>
    `,
  };

  const result = await transporter.sendMail(mailOptions);

  if (result.accepted.length > 0) {
    return [true, null];
  } else {
    return [null, "Email not sent"];
  }
}
