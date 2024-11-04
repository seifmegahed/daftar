"use client";

import { useEffect, useState } from "react";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { deleteAddressAction } from "@/server/actions/addresses";
import { updateClientPrimaryAddressAction } from "@/server/actions/clients/update";
import { updateSupplierPrimaryAddressAction } from "@/server/actions/suppliers/update";
import { toast } from "sonner";
import { usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";

type AddressActionButtonsProps = {
  isPrimary: boolean;
  addressId: number;
  referenceId: number;
  referenceType: "client" | "supplier";
};

const AddressActionButtons = ({
  isPrimary,
  addressId,
  referenceId,
  referenceType,
}: AddressActionButtonsProps) => {
  const t = useTranslations("address-card.action-buttons");
  
  const pathname = usePathname();
  const [primaryLoading, setPrimaryLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleClick = async () => {
    setPrimaryLoading(true);
    try {
      const [, error] =
        referenceType === "client"
          ? await updateClientPrimaryAddressAction(referenceId, addressId)
          : await updateSupplierPrimaryAddressAction(referenceId, addressId);
      if (error !== null) {
        toast.error(error);
        return;
      }
      toast.success(t("success"));
    } catch (error) {
      console.log(error);
      toast.error(t("error"));
    } finally {
      setPrimaryLoading(false);
    }
  };

  const handleDelete = async () => {
    const result = confirm(t("confirm-delete"));
    if (!result) return;
    setDeleteLoading(true);
    try {
      const [, error] = await deleteAddressAction(addressId, pathname);
      if (error !== null) {
        toast.error(error);
        return;
      }
      toast.success(t("delete-success"));
    } catch (error) {
      console.log(error);
      toast.error(t("delete-error"));
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    setPrimaryLoading(false);
  }, [isPrimary]);

  return (
    <div className="flex gap-2">
      {isPrimary ? (
        <div className="flex h-8 w-24 select-none items-center justify-center rounded-full bg-green-200 px-3 py-1 text-xs dark:bg-green-600 sm:w-32">
          <p>{t("primary")}</p>
        </div>
      ) : (
        <Button
          variant="outline"
          className="h-8 w-24 rounded-full px-3 py-1 text-xs font-normal sm:w-32"
          disabled={primaryLoading}
          onClick={handleClick}
        >
          {primaryLoading ? (
            <Loading className="h-4 w-4" />
          ) : (
            <p>{t("set-primary")}</p>
          )}
        </Button>
      )}
      <Button
        variant="outline"
        className="h-8 w-24 rounded-full px-3 py-1 text-xs font-normal text-destructive sm:w-32"
        disabled={isPrimary || deleteLoading}
        onClick={handleDelete}
      >
        {deleteLoading ? <Loading className="h-4 w-4" /> : <p>{t("delete")}</p>}
      </Button>
    </div>
  );
};

export default AddressActionButtons;
