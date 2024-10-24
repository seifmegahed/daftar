import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import ContactActionButtons from "../contact/action-buttons";
import type { ContactType } from "@/server/db/tables/contact/queries";
import CardWrapper from "@/components/card-wrapper";

const ContactCard = ({
  contact,
  isPrimary,
  referenceId,
  referenceType,
}: {
  contact: ContactType;
  isPrimary: boolean;
  referenceId: number;
  referenceType: "client" | "supplier";
}) => {
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
              <p>Email</p>
              <p>{contact.email ?? "N/A"}</p>
            </div>
            <div className="flex justify-between">
              <p>Phone Number</p>
              <p>{contact.phoneNumber ?? "N/A"}</p>
            </div>
          </div>
          <div>
            <div className="flex justify-between">
              <p>Created By</p>
              <p>{contact.createdBy}</p>
            </div>
            <div className="flex justify-between">
              <p>Created At</p>
              <p>{format(contact.createdAt, "PP")}</p>
            </div>

            {contact.updatedBy ? (
              <div className="flex justify-between">
                <p>Updated By</p>
                <p>{contact.updatedBy}</p>
              </div>
            ) : null}
            {contact.updatedAt ? (
              <div className="flex justify-between">
                <p>Updated At</p>
                <p>{format(contact.updatedAt, "PP")}</p>
              </div>
            ) : null}
          </div>
          {contact.notes ? (
            <div className="sm:col-span-2 col-span-1 flex flex-col gap-2">
              <p>Notes</p>
              <p>{contact.notes}</p>
            </div>
          ) : null}
        </div>
      </div>
    </CardWrapper>
  );
};

export default ContactCard;
