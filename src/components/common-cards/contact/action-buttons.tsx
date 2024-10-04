"use client";

import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { deleteContactAction } from "@/server/actions/contacts";
import { updateClientPrimaryContactAction } from "@/server/actions/clients";
import { updateSupplierPrimaryContactAction } from "@/server/actions/suppliers/update";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
  const navigate = useRouter();
  const [primaryLoading, setPrimaryLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleClick = async () => {
    try {
      setPrimaryLoading(true);
      const [, error] =
        referenceType === "client"
          ? await updateClientPrimaryContactAction(referenceId, contactId)
          : await updateSupplierPrimaryContactAction(referenceId, contactId);
      if (error !== null) {
        console.log(error);
        toast.error("Error updating primary contact");
        setPrimaryLoading(false);
      }
      toast.success("Primary contact updated");
      navigate.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Error updating primary contact");
      setPrimaryLoading(false);
    }
  };

  const handleDelete = async () => {
    const result = confirm("Are you sure you want to delete this contact?");
    if (!result) return;
    try {
      setDeleteLoading(true);
      const [, error] = await deleteContactAction(contactId);
      if (error !== null) {
        console.log(error);
        toast.error("Error deleting contact");
        setDeleteLoading(false);
      }
      toast.success("Contact deleted");
      navigate.refresh();
      setDeleteLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Error deleting contact");
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

export default ContactActionButtons;
