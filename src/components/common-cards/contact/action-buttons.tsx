"use client";

import { useEffect, useState } from "react";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { deleteContactAction } from "@/server/actions/contacts";
import { updateClientPrimaryContactAction } from "@/server/actions/clients/update";
import { updateSupplierPrimaryContactAction } from "@/server/actions/suppliers/update";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

const ContactActionButtons = ({
  isPrimary,
  contactId,
  referenceId,
  referenceType,
}: {
  isPrimary: boolean;
  contactId: number;
  referenceId: number;
  referenceType: "client" | "supplier";
}) => {
  const pathname = usePathname();
  const [primaryLoading, setPrimaryLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleClick = async () => {
    setPrimaryLoading(true);
    try {
      const [, error] =
        referenceType === "client"
          ? await updateClientPrimaryContactAction(referenceId, contactId)
          : await updateSupplierPrimaryContactAction(referenceId, contactId);
      if (error !== null) {
        toast.error(error);
        return;
      }
      toast.success("Primary contact updated");
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while updating primary contact");
    } finally {
      setPrimaryLoading(false);
    }
  };

  const handleDelete = async () => {
    const result = confirm("Are you sure you want to delete this contact?");
    if (!result) return;
    setDeleteLoading(true);
    try {
      const [, error] = await deleteContactAction(contactId, pathname);
      if (error !== null) {
        toast.error(error);
        return;
      }
      toast.success("Contact deleted");
      setDeleteLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while deleting contact");
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
          <p>Primary</p>
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
            <p>Set Primary</p>
          )}
        </Button>
      )}
      <Button
        variant="outline"
        className="h-8 w-24 rounded-full px-3 py-1 text-xs font-normal text-destructive sm:w-32"
        disabled={isPrimary || deleteLoading}
        onClick={handleDelete}
      >
        {deleteLoading ? <Loading className="h-4 w-4" /> : <p>Delete</p>}
      </Button>
    </div>
  );
};

export default ContactActionButtons;
