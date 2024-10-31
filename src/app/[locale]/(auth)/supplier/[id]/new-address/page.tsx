import NewAddressForm from "@/components/common-forms/address-form";
import ErrorPage from "@/components/error";

export default function NewAddressPage({ params }: { params: { id: string } }) {
  const supplierId = parseInt(params.id);
  if (isNaN(supplierId)) return <ErrorPage message="Invalid supplier ID" />;
  
  return <NewAddressForm id={supplierId} type="supplier" />;
}
