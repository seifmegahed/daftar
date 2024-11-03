import SupplierCardContextMenu from "./card-menu";
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
  CardSubtitleSection,
} from "@/components/card-sections";

import type { BriefSupplierType } from "@/server/db/tables/supplier/queries";
import { getTranslations } from "next-intl/server";

const SupplierCard = async ({ supplier }: { supplier: BriefSupplierType }) => {
  const t = await getTranslations("supplier-card.tips");
  return (
    <CardWrapper>
      <CardIdSection href={`/supplier/${supplier.id}`} id={supplier.id} />
      <CardBodyContainer>
        <CardBodyStartContainer>
          <CardNameSection
            name={supplier.name}
            href={`/supplier/${supplier.id}`}
          />
          <CardSubtitleSection subtitle={supplier.field} tip={t("field")} />
        </CardBodyStartContainer>
        <CardBodyEndContainer>
          <CardSection
            text={supplier.registrationNumber}
            tip={t("registration-number")}
          />
          <CardCreatedAtSection date={supplier.createdAt} />
        </CardBodyEndContainer>
      </CardBodyContainer>
      <CardMenuContainer>
        <SupplierCardContextMenu supplierId={supplier.id} />
      </CardMenuContainer>
    </CardWrapper>
  );
};

export default SupplierCard;
