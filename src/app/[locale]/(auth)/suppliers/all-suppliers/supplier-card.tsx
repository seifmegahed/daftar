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

const SupplierCard = ({ supplier }: { supplier: BriefSupplierType }) => {
  return (
    <CardWrapper>
      <CardIdSection href={`/supplier/${supplier.id}`} id={supplier.id} />
      <CardBodyContainer>
        <CardBodyStartContainer>
          <CardNameSection
            name={supplier.name}
            href={`/supplier/${supplier.id}`}
          />
          <CardSubtitleSection subtitle={supplier.field} tip="Field" />
        </CardBodyStartContainer>
        <CardBodyEndContainer>
          <CardSection
            text={supplier.registrationNumber}
            tip="Registration Number"
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
