import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import ContactActionButtons from "../contact/action-buttons";
import CardWrapper from "@/components/card-wrapper";
import { getLocale, getTranslations } from "next-intl/server";
import { getDateLocaleFormat } from "@/utils/common";

import type { ContactType } from "@/server/db/tables/contact/queries";

type ContactCardProps = {
  contact: ContactType;
  isPrimary: boolean;
  referenceId: number;
  referenceType: "client" | "supplier";
};
const ContactCard = async ({
  contact,
  isPrimary,
  referenceId,
  referenceType,
}: ContactCardProps) => {
  const locale = await getLocale();
  const t = await getTranslations("contact-card");
  const localizedDateFormat = getDateLocaleFormat(locale);

  return (
    <CardWrapper>
      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold">{contact.name}</h2>
          <ContactActionButtons
            isPrimary={isPrimary}
            contactId={contact.id}
            referenceId={referenceId}
            referenceType={referenceType}
          />
        </div>
        <Separator />
        <div className="grid sm:grid-cols-2 gap-4 text-muted-foreground">
          <div>
            <div className="flex justify-between">
              <p>{t("email")}</p>
              <p>{contact.email ?? "N/A"}</p>
            </div>
            <div className="flex justify-between">
              <p>{t("phone-number")}</p>
              <p>{contact.phoneNumber ?? "N/A"}</p>
            </div>
          </div>
          <div>
            <div className="flex justify-between">
              <p>{t("created-by")}</p>
              <p>{contact.createdBy}</p>
            </div>
            <div className="flex justify-between">
              <p>{t("created-at")}</p>
              <p>{format(contact.createdAt, "PP", { locale: localizedDateFormat })}</p>
            </div>

            {contact.updatedBy ? (
              <div className="flex justify-between">
                <p>{t("updated-by")}</p>
                <p>{contact.updatedBy}</p>
              </div>
            ) : null}
            {contact.updatedAt ? (
              <div className="flex justify-between">
                <p>{t("updated-at")}</p>
                <p>{format(contact.updatedAt, "PP", { locale: localizedDateFormat })}</p>
              </div>
            ) : null}
          </div>
          {contact.notes ? (
            <div className="sm:col-span-2 col-span-1 flex flex-col gap-2">
              <p>{t("notes")}</p>
              <p>{contact.notes}</p>
            </div>
          ) : null}
        </div>
      </div>
    </CardWrapper>
  );
};

export default ContactCard;
