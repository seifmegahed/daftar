import { format } from "date-fns";
import { z } from "zod";

export const commercialOfferInputSchema = z.object({
  title: z.string().default("ACME INC"),
  date: z.string().default(format(new Date(), "dd MMMM yyyy")),
  companyName: z.string().default("ACME INC"),
  companyField: z
    .object({
      companyAddress: z.string().default("51 Rosetta st."),
      companyCountry: z.string().default("Alexandria, Egypt"),
      companyPhoneNmB: z.string().default("+20 123 456 789"),
      companyPhoneNmA: z.string().default("+20 123 456 789"),
      companyEmail: z.string().default("info@acme-inc.com"),
    })
    .transform((value) => JSON.stringify(value)),
  clientName: z.string(),
  clientField: z
    .object({
      clientAddress: z.string(),
      clientCountry: z.string(),
      clientPhoneNumber: z.string(),
      clientEmail: z.string(),
    })
    .transform((value) => JSON.stringify(value)),
  projectData: z
    .object({
      offerReference: z.string(),
      projectName: z.string(),
      projectManager: z.string(),
      ownerNumber: z.string().default("+20 123 456 7890"),
      ownerEmail: z.string().default("sales@acme-inc.com"),
    })
    .transform((value) => JSON.stringify(value)),
  offerValidity: z
    .object({
      companyName: z.string().default("ACME INC"),
      offerValidityInDays: z.string().default("7"),
    })
    .transform((value) => JSON.stringify(value)),
  deliveryPeriod: z
    .object({
      deliveryPeriod: z.string().default("2 - 3 months"),
    })
    .transform((value) => JSON.stringify(value)),
  payment: z
    .object({
      advancePercentage: z.string().default("25"),
      postPercentage: z.string().default("75"),
    })
    .transform((value) => JSON.stringify(value)),
  items: z
    .array(
      z.object({
        name: z.string(),
        quantity: z.string(),
        price: z.string(),
        total: z.string(),
        cur: z.string().default("EGP"),
      }),
    )
    .transform((value) =>
      value.map((item) => [
        item.name,
        item.quantity,
        item.price,
        item.total,
        item.cur,
      ]),
    ),
});

export type CommercialOfferInputType = z.infer<
  typeof commercialOfferInputSchema
>;
