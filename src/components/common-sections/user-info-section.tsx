import { format } from "date-fns";
import DataDisplayUnit from "../data-display-unit";

const UserInfoSection = ({
  data,
}: {
  data: {
    createdAt: Date;
    updatedAt?: Date | null;
    creator: { id: number; name: string };
    updater?: { id: number; name: string } | null;
  };
}) => {
  const { createdAt, updatedAt, creator, updater } = data;
  return (
    <div className="flex flex-col gap-y-2">
      <DataDisplayUnit label="Created At" values={[format(createdAt, "PP")]} />
      <DataDisplayUnit label="Created By" values={[creator.name]} />
      {updater && (
        <>
          <DataDisplayUnit
            label="Updated At"
            values={[updatedAt ? format(updatedAt, "PP") : "N/A"]}
          />
          <DataDisplayUnit label="Updated By" values={[updater.name]} />
        </>
      )}
    </div>
  );
};

export default UserInfoSection;
