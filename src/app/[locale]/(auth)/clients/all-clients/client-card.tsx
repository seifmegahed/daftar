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
import { getTranslations } from "next-intl/server";

import type { BriefClientType } from "@/server/db/tables/client/queries";

const ClientCard = async ({ client }: { client: BriefClientType }) => {
  const t = await getTranslations("client-card.tips");
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
            tip={t("registration-number")}
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
