import DescriptionForm from "@/components/common-forms/update-description-form";
import NameForm from "@/components/common-forms/update-name-form";
import NotesForm from "@/components/common-forms/update-notes-form";
import InfoPageWrapper from "@/components/info-page-wrapper";
import { getItemDetailsAction } from "@/server/actions/items";
import {
  updateItemDescriptionAction,
  updateItemNameAction,
  updateItemNotesAction,
} from "@/server/actions/items/update";
import { getCurrentUserAction } from "@/server/actions/users";
import TypeForm from "./type-form";
import MakeForm from "./make-form";
import MpnForm from "./mpn-form";
import { getItemProjectsCountAction } from "@/server/actions/project-items/read";
import DeleteFormInfo from "@/components/common-forms/delete-form/DeleteFormInfo";
import DeleteForm from "@/components/common-forms/delete-form";
import { deleteItemAction } from "@/server/actions/items/delete";

async function EditItemPage({ params }: { params: { id: string } }) {
  const itemId = Number(params.id);
  if (isNaN(itemId)) return <p>Error: Item ID is not a number</p>;

  const [item, error] = await getItemDetailsAction(itemId);
  if (error !== null) return <p>An error occurred, please try again.</p>;

  const [currentUser] = await getCurrentUserAction();
  const hasFullAccess = currentUser?.role === "admin";

  const [itemReferences, itemReferencesError] =
    await getItemProjectsCountAction(itemId);

  const deleteFormInfo =
    itemReferences !== null && itemReferences > 0 ? (
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
