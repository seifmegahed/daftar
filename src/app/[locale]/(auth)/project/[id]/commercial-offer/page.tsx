import ErrorPage from "@/components/error";
import GenerateOfferForm from "./form";
import { hasAccessToPrivateDataAction } from "@/server/actions/users";

async function CommercialOffer({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  if (isNaN(id)) return <ErrorPage message="Invalid project ID" />;

  const [access] = await hasAccessToPrivateDataAction();
  if (!access)
    return <ErrorPage message="You are not authorized to view this page" />;
  return (
    <GenerateOfferForm  projectId={id} />
  );
}

export default CommercialOffer;
