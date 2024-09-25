import NewAddressForm from "@/components/common-forms/new-address-form";

export default function NewAddressPage({ params }: { params: { id: string } }) {
  return <NewAddressForm id={Number(params.id)} type="client" />;
}
