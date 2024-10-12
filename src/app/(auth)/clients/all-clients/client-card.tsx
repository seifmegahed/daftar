import Link from "next/link";
import { format } from "date-fns";
import { type BriefClientType } from "@/server/db/tables/client/queries";
import ClientCardContextMenu from "./card-menu";

const ClientCard = ({ client }: { client: BriefClientType }) => {
  return (
    <div className="flex items-center gap-5 rounded-xl border p-4">
      <Link href={`/client/${client.id}`}>
        <div className="flex cursor-pointer items-center justify-center">
          <p className="w-10 text-end text-2xl font-bold text-foreground">
            {client.id}
          </p>
        </div>
      </Link>
      <div className="flex w-full items-center justify-between">
        <Link href={`/client/${client.id}`}>
          <p className="cursor-pointer text-foreground hover:underline text-xl line-clamp-1">
            {client.name}
          </p>
        </Link>
        <div className="w-60 text-end">
          <p className="text-foreground line-clamp-1">{client.registrationNumber}</p>
          <p className="text-xs text-muted-foreground">
            {format(client.createdAt, "PP")}
          </p>
        </div>
      </div>
      <ClientCardContextMenu clientId={client.id} />
    </div>
  );
};

export default ClientCard;
