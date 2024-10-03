import { Separator } from "@/components/ui/separator";
import { type SelectAddressType } from "@/server/db/tables/address/schema";
import { format } from "date-fns";
import AddressActionButtons from "./address-card-action-buttons";

const AddressCard = ({
  address,
  isPrimary,
  clientId,
}: {
  address: SelectAddressType;
  isPrimary: boolean;
  clientId: number;
}) => {
  return (
    <div className="flex flex-col gap-4 rounded-lg border p-4">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">{address.name}</h2>
        <AddressActionButtons
          isPrimary={isPrimary}
          clientId={clientId}
          addressId={address.id}
        />
      </div>
      <Separator />
      <div className="grid grid-cols-2 gap-4 text-muted-foreground">
        <div>
          <div className="flex justify-between">
            <p>Address</p>
            <p>{address.addressLine}</p>
          </div>
          <div className="flex justify-between">
            <p>Country</p>
            <p>{address.country}</p>
          </div>
          {address.city ? (
            <div className="flex justify-between">
              <p>City</p>
              <p>{address.city}</p>
            </div>
          ) : null}
        </div>
        <div>
          <div className="flex justify-between">
            <p>Created By</p>
            <p>{address.createdBy}</p>
          </div>
          <div className="flex justify-between">
            <p>Created At</p>
            <p>{format(address.createdAt, "PP")}</p>
          </div>

          {address.updatedBy ? (
            <div className="flex justify-between">
              <p>Updated By</p>
              <p>{address.updatedBy}</p>
            </div>
          ) : null}
          {address.updatedAt ? (
            <div className="flex justify-between">
              <p>Updated At</p>
              <p>{format(address.updatedAt, "PP")}</p>
            </div>
          ) : null}
        </div>
        {address.notes ? (
          <div className="col-span-2 flex flex-col gap-2">
            <p>Notes</p>
            <p>{address.notes}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AddressCard;
