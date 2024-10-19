import { getItemDetailsAction } from "@/server/actions/items/read";
import {
  updateItemDescriptionAction,
  updateItemNameAction,
  updateItemNotesAction,
} from "@/server/actions/items/update";
import { deleteItemAction } from "@/server/actions/items/delete";
import { getCurrentUserAction } from "@/server/actions/users";
import { getItemProjectsCountAction } from "@/server/actions/purchase-items/read";

import InfoPageWrapper from "@/components/info-page-wrapper";

import DescriptionForm from "@/components/common-forms/update-description-form";
import NameForm from "@/components/common-forms/update-name-form";
import NotesForm from "@/components/common-forms/update-notes-form";
import TypeForm from "./type-form";
import MakeForm from "./make-form";
import MpnForm from "./mpn-form";
import DeleteForm from "@/components/common-forms/delete-form";

import DeleteFormInfo from "@/components/common-forms/delete-form/DeleteFormInfo";
import ErrorPage from "@/components/error";

async function EditItemPage({ params }: { params: { id: string } }) {
  const itemId = parseInt(params.id);
  if (isNaN(itemId)) return <ErrorPage message="Invalid item ID" />;

  const [item, error] = await getItemDetailsAction(itemId);
  if (error !== null) return <ErrorPage message={error} />;

  const [currentUser] = await getCurrentUserAction();
  const hasFullAccess = currentUser?.role === "admin";

  const [itemReferences, itemReferencesError] =
    await getItemProjectsCountAction(itemId);
  if (itemReferencesError !== null)
    return <ErrorPage message={itemReferencesError} />;

  const deleteFormInfo =
    itemReferences > 0 ? (
      <>
        {`You cannot delete an item that is referenced in ${itemReferences > 1 ? `${itemReferences} projects` : "a project"}. If you want to delete this item, you must first unlink it from all its references.`}
      </>
    ) : (
      <DeleteFormInfo type="item" />
    );

  return (
    <InfoPageWrapper
      title="Edit Item"
      subtitle={`This is the edit page for the item: ${item.name}. Here you can edit the item details.`}
    >
      <NameForm
        id={itemId}
        updateCallbackAction={updateItemNameAction}
        type="item"
        access={hasFullAccess}
        name={item.name}
      />
      <TypeForm id={itemId} defaultValue={item.type ?? ""} />
      <DescriptionForm
        id={itemId}
        updateCallbackAction={updateItemDescriptionAction}
        description={item.description ?? ""}
        type="item"
      />
      <MakeForm id={itemId} defaultValue={item.make ?? ""} />
      <MpnForm id={itemId} defaultValue={item.mpn ?? ""} />
      <NotesForm
        id={itemId}
        updateCallbackAction={updateItemNotesAction}
        notes={item.notes ?? ""}
        type="item"
      />
      {itemReferencesError === null && (
        <DeleteForm
          name={item.name}
          access={hasFullAccess}
          type="item"
          id={itemId}
          disabled={itemReferences > 0}
          onDelete={deleteItemAction}
          formInfo={deleteFormInfo}
        />
      )}
    </InfoPageWrapper>
  );
}

export default EditItemPage;
