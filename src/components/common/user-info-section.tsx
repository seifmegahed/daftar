import { format } from "date-fns";

const UserInfoSection = ({
  data,
}: {
  data: {
    createdAt: Date;
    updatedAt: Date | null;
    creator: { id: number; name: string };
    updater: { id: number; name: string } | null;
  };
}) => {
  const { createdAt, updatedAt, creator, updater } = data;
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex justify-between">
        <p>Created At</p>
        <p>{format(createdAt, "PP")}</p>
      </div>
      <div className="flex justify-between">
        <p>Created By</p>
        <p>{creator.name}</p>
      </div>
      <div className="flex justify-between">
        <p>Updated At</p>
        <p>{updatedAt ? format(updatedAt, "PP") : "N/A"}</p>
      </div>
      <div className="flex justify-between">
        <p>Updated By</p>
        <p>{updater ? updater.name : "N/A"}</p>
      </div>
    </div>
  );
};

export default UserInfoSection;
