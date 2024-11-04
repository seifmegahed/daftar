import InfoPageWrapper from "@/components/info-page-wrapper";
import NotesForm from "@/components/common-forms/update-notes-form";
import RegistrationNumberForm from "@/components/common-forms/update-registration-form";
import WebsiteForm from "@/components/common-forms/update-website-form";
import { getCurrentUserAction } from "@/server/actions/users";
import {
  updateSupplierNotesAction,
  updateSupplierRegistrationNumberAction,
  updateSupplierWebsiteAction,
} from "@/server/actions/suppliers/update";
import { getSupplierFullByIdAction } from "@/server/actions/suppliers/read";
import FieldUpdateForm from "./update-field-form";
import { getSupplierProjectsCountAction } from "@/server/actions/purchase-items/read";
import DeleteForm from "@/components/common-forms/delete-form";
import { deleteSupplierAction } from "@/server/actions/suppliers/delete";
import ErrorPage from "@/components/error";
import { setLocale } from "@/i18n/set-locale";
import { getTranslations } from "next-intl/server";

async function EditSupplierPage({
  params,
}: {
  params: { id: string; locale: Locale };
}) {
  setLocale(params.locale);
  const t = await getTranslations("supplier.edit");

  const supplierId = parseInt(params.id);
  if (isNaN(supplierId)) return <ErrorPage message={t("invalid-id")} />;

  const [supplier, error] = await getSupplierFullByIdAction(supplierId);
  if (error !== null) return <ErrorPage message={error} />;

  const [currentUser] = await getCurrentUserAction();
  const hasFullAccess = currentUser?.role === "admin";

  const [supplierProjects, supplierProjectsError] =
    await getSupplierProjectsCountAction(supplierId);
  if (supplierProjectsError !== null)
    return <ErrorPage message={supplierProjectsError} />;

  const hasProjects = supplierProjects > 0;

  const DeleteFormInfoSelector = () =>
    hasProjects ? (
      <>
        {t("delete-form-info", {
          count: supplierProjects,
        })}
      </>
    ) : undefined;

  return (
    <InfoPageWrapper
      title={t("title")}
      subtitle={t("subtitle", { supplierName: supplier.name })}
    >
      <FieldUpdateForm id={supplierId} field={supplier.field ?? ""} />
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
      {supplierProjects !== null && (
        <DeleteForm
          name={supplier.name}
          access={hasFullAccess}
          type="supplier"
          id={supplierId}
          disabled={supplierProjects > 0}
          onDelete={deleteSupplierAction}
          FormInfo={<DeleteFormInfoSelector />}
        />
      )}
    </InfoPageWrapper>
  );
}
export default EditSupplierPage;
