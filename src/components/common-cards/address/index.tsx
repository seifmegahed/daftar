import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import AddressActionButtons from "./action-buttons";
import CardWrapper from "@/components/card-wrapper";
import { getLocale, getTranslations } from "next-intl/server";
import { getDateLocaleFormat } from "@/utils/common";

import type { AddressType } from "@/server/db/tables/address/queries";

type AddressCardProps = {
  address: AddressType;
  isPrimary: boolean;
  referenceId: number;
  referenceType: "client" | "supplier";
};

const AddressCard = async ({
  address,
  isPrimary,
  referenceId,
  referenceType,
}: AddressCardProps) => {
  const locale = await getLocale();
  const t = await getTranslations("address-card");
  const localizedDateFormat = getDateLocaleFormat(locale);

  return (
    <CardWrapper>
      <div className="flex w-full flex-col gap-4">
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold">{address.name}</h2>
          <AddressActionButtons
            isPrimary={isPrimary}
            addressId={address.id}
            referenceId={referenceId}
            referenceType={referenceType}
          />
        </div>
        <Separator />
        <div className="grid gap-4 text-muted-foreground sm:grid-cols-2">
          <div>
            <div className="flex justify-between">
              <p>{t("address-line")}</p>
              <p>{address.addressLine}</p>
            </div>
            <div className="flex justify-between">
              <p>{t("country")}</p>
              <p>{address.country}</p>
            </div>
            {address.city ? (
              <div className="flex justify-between">
                <p>{t("city")}</p>
                <p>{address.city ?? "N/A"}</p>
              </div>
            ) : null}
          </div>
          <div>
            <div className="flex justify-between">
              <p>{t("created-by")}</p>
              <p>{address.createdBy}</p>
            </div>
            <div className="flex justify-between">
              <p>{t("created-at")}</p>
              <p>
                {format(address.createdAt, "PP", {
                  locale: localizedDateFormat,
                })}
              </p>
            </div>

            {address.updatedBy ? (
              <div className="flex justify-between">
                <p>{t("updated-by")}</p>
                <p>{address.updatedBy}</p>
              </div>
            ) : null}
            {address.updatedAt ? (
              <div className="flex justify-between">
                <p>{t("updated-at")}</p>
                <p>
                  {format(address.updatedAt, "PP", {
                    locale: localizedDateFormat,
                  })}
                </p>
              </div>
            ) : null}
          </div>
          {address.notes ? (
            <div className="col-span-2 flex flex-col gap-2">
              <p>{t("notes")}</p>
              <p>{address.notes}</p>
            </div>
          ) : null}
        </div>
      </div>
    </CardWrapper>
  );
};

export default AddressCard;
