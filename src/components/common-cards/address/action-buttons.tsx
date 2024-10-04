"use client";

import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { deleteAddressAction } from "@/server/actions/addresses";
import { updateClientPrimaryAddressAction } from "@/server/actions/clients/update";
import { updateSupplierPrimaryAddressAction } from "@/server/actions/suppliers/update";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const AddressActionButtons = ({
  isPrimary,
  addressId,
  referenceId,
  referenceType,
}: {
  isPrimary: boolean;
  addressId: number;
  referenceId: number;
  referenceType: "client" | "supplier";
}) => {
  const navigate = useRouter();
  const [primaryLoading, setPrimaryLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleClick = async () => {
    try {
      setPrimaryLoading(true);
      const [, error] =
        referenceType === "client"
          ? await updateClientPrimaryAddressAction(referenceId, addressId)
          : await updateSupplierPrimaryAddressAction(referenceId, addressId);
      if (error !== null) {
        console.log(error);
        toast.error("Error updating primary address");
        setPrimaryLoading(false);
      }
      toast.success("Primary address updated");
      navigate.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Error updating primary address");
      setPrimaryLoading(false);
    }
  };

  const handleDelete = async () => {
    const result = confirm("Are you sure you want to delete this address?");
    if (!result) return;
    try {
      setDeleteLoading(true);
      const [, error] = await deleteAddressAction(addressId);
      if (error !== null) {
        console.log(error);
        toast.error("Error deleting address");
        setDeleteLoading(false);
      }
      toast.success("Address deleted");
      navigate.refresh();
      setDeleteLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Error deleting address");
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    setPrimaryLoading(false);
  }, [isPrimary]);

  return (
    <div className="flex gap-2">
      {isPrimary ? (
        <div className="flex w-32 select-none items-center justify-center rounded-full bg-green-200 px-3 py-1 text-xs dark:bg-green-600">
          <p>Primary</p>
        </div>
      ) : (
        <Button
          variant="outline"
          className="h-[32px] w-32 rounded-full px-3 py-1 text-xs font-normal"
          disabled={primaryLoading}
          onClick={handleClick}
        >
          {primaryLoading ? (
            <Loading className="h-4 w-4" />
          ) : (
            <p>Set Primary</p>
          )}
        </Button>
      )}
      <Button
        variant="outline"
        className="h-[32px] w-32 rounded-full px-3 py-1 text-xs font-normal text-destructive"
        disabled={isPrimary || deleteLoading}
        onClick={handleDelete}
      >
        {deleteLoading ? <Loading className="h-4 w-4" /> : <p>Delete</p>}
      </Button>
    </div>
  );
};

export default AddressActionButtons;
