import InfoPageWrapper from "@/components/info-page-wrapper";
import NotesForm from "@/components/common-forms/update-notes-form";
import RegistrationNumberForm from "@/components/common-forms/update-registration-form";
import WebsiteForm from "@/components/common-forms/update-website-form";
import { getCurrentUserAction } from "@/server/actions/users";
import DeleteSupplierForm from "./delete-supplier-form";
import {
  updateSupplierNotesAction,
  updateSupplierRegistrationNumberAction,
  updateSupplierWebsiteAction,
} from "@/server/actions/suppliers/update";
import { getSupplierFullByIdAction } from "@/server/actions/suppliers/read";

async function EditSupplierPage({ params }: { params: { id: string } }) {
  const supplierId = Number(params.id);
  if (isNaN(supplierId)) return <p>Error: Supplier ID is not a number</p>;

  const [supplier, error] = await getSupplierFullByIdAction(supplierId);
  if (error !== null) return <p>An error occurred, please try again.</p>;

  const [currentUser] = await getCurrentUserAction();
  const hasFullAccess = currentUser?.role === "admin";

  return (
    <InfoPageWrapper
      title="Edit Supplier"
      subtitle={`This is the edit page for the supplier: ${supplier.name}. Here you can edit the supplier details.`}
    >
      <RegistrationNumberForm
        id={supplierId}
        updateRegistrationNumberCallbackAction={
          updateSupplierRegistrationNumberAction
        }
        type="supplier"
        registrationNumber={supplier.registrationNumber ?? ""}
      />
      <WebsiteForm
        id={supplierId}
        updateWebsiteCallbackAction={updateSupplierWebsiteAction}
        website={supplier.website ?? ""}
        type="supplier"
      />
      <NotesForm
        id={supplierId}
        updateCallbackAction={updateSupplierNotesAction}
        notes={supplier.notes ?? ""}
        type="supplier"
      />
      <DeleteSupplierForm
        id={supplierId}
        name={supplier.name}
        access={hasFullAccess}
      />
    </InfoPageWrapper>
  );
}
export default EditSupplierPage;
