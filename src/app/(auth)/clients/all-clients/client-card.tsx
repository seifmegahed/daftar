import { type BriefClientType } from "@/server/db/tables/client/queries";
import ClientCardContextMenu from "./card-menu";
import CardWrapper from "@/components/card-wrapper";
import {
  CardBodyContainer,
  CardBodyEndContainer,
  CardBodyStartContainer,
  CardCreatedAtSection,
  CardIdSection,
  CardMenuContainer,
  CardNameSection,
  CardSection,
} from "@/components/card-sections";

const ClientCard = ({ client }: { client: BriefClientType }) => {
  return (
    <CardWrapper>
      <CardIdSection href={`/client/${client.id}`} id={client.id} />
      <CardBodyContainer>
        <CardBodyStartContainer>
          <CardNameSection name={client.name} href={`/client/${client.id}`} />
        </CardBodyStartContainer>
        <CardBodyEndContainer>
          <CardSection
            text={client.registrationNumber}
            tip="Registration Number"
          />
          <CardCreatedAtSection date={client.createdAt} />
        </CardBodyEndContainer>
      </CardBodyContainer>
      <CardMenuContainer>
        <ClientCardContextMenu clientId={client.id} />
      </CardMenuContainer>
    </CardWrapper>
  );
};

export default ClientCard;
