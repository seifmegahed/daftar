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

async function EditItemPage({ params }: { params: { id: string } }) {
  const itemId = Number(params.id);
  if (isNaN(itemId)) return <p>Error: Item ID is not a number</p>;

  const [item, error] = await getItemDetailsAction(itemId);
  if (error !== null) return <p>An error occurred, please try again.</p>;

  const [currentUser] = await getCurrentUserAction();
  const hasFullAccess = currentUser?.role === "admin";

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
    </InfoPageWrapper>
  );
}

export default EditItemPage;
