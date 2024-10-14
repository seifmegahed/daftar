import Link from "next/link";
import { format } from "date-fns";
import { type BriefClientType } from "@/server/db/tables/client/queries";
import ClientCardContextMenu from "./card-menu";
import CardWrapper from "@/components/card-wrapper";

const ClientCard = ({ client }: { client: BriefClientType }) => {
  return (
    <CardWrapper>
      <Link href={`/client/${client.id}`} className="hidden sm:block">
        <div className="flex cursor-pointer items-center justify-center">
          <p className="w-10 text-end text-2xl font-bold text-foreground">
            {client.id}
          </p>
        </div>
      </Link>
      <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
        <Link href={`/client/${client.id}`}>
          <p className="line-clamp-1 cursor-pointer text-lg font-bold text-foreground hover:underline">
            {client.name}
          </p>
        </Link>
        <div className="sm:w-60 sm:text-end">
          <p className="line-clamp-1 text-foreground">
            {client.registrationNumber}
          </p>
          <p className="text-xs text-muted-foreground">
            {format(client.createdAt, "PP")}
          </p>
        </div>
      </div>
      <ClientCardContextMenu clientId={client.id} />
    </CardWrapper>
  );
};

export default ClientCard;
