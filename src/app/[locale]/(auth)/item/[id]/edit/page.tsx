import { getItemDetailsAction } from "@/server/actions/items/read";
import {
  updateItemDescriptionAction,
  updateItemNameAction,
  updateItemNotesAction,
  updateItemTags,
} from "@/server/actions/items/update";
import { deleteItemAction } from "@/server/actions/items/delete";
import { getCurrentUserAction } from "@/server/actions/users";
import { getItemProjectsCountAction } from "@/server/actions/items/read";

import InfoPageWrapper from "@/components/info-page-wrapper";

import DescriptionForm from "@/components/common-forms/update-description-form";
import NameForm from "@/components/common-forms/update-name-form";
import NotesForm from "@/components/common-forms/update-notes-form";
import TypeForm from "./type-form";
import MakeForm from "./make-form";
import MpnForm from "./mpn-form";
import DeleteForm from "@/components/common-forms/delete-form";

import ErrorPage from "@/components/error";
import { setLocale } from "@/i18n/set-locale";
import { getTranslations } from "next-intl/server";
import UpdateTagsForm from "@/components/common-forms/update-tag-form";

async function EditItemPage({
  params,
}: {
  params: { id: string; locale: Locale };
}) {
  setLocale(params.locale);
  const t = await getTranslations("item.edit");
  const itemId = parseInt(params.id);
  if (isNaN(itemId)) return <ErrorPage message={t("invalid-id")} />;

  const [item, error] = await getItemDetailsAction(itemId);
  if (error !== null) return <ErrorPage message={error} />;

  const [currentUser] = await getCurrentUserAction();
  const hasFullAccess = currentUser?.role === "admin";

  const [itemReferences, itemReferencesError] =
    await getItemProjectsCountAction(itemId);
  if (itemReferencesError !== null)
    return <ErrorPage message={itemReferencesError} />;

  const hasReferences = itemReferences > 0;

  const DeleteFormInfoSelector = () =>
    hasReferences ? (
      <>{t("delete-form-info", { count: itemReferences })}</>
    ) : undefined;

  const tags = item.tags.map((itemTag) => itemTag.tag.name) ?? [];

  return (
    <InfoPageWrapper
      title={t("title")}
      subtitle={t("subtitle", { itemName: item.name })}
    >
      <NameForm
        id={itemId}
        updateCallbackAction={updateItemNameAction}
        type="item"
        access={hasFullAccess}
        name={item.name}
      />
      <TypeForm id={itemId} defaultValue={item.type ?? ""} />
      <UpdateTagsForm
        id={itemId}
        tags={tags ?? ([] as string[])}
        onUpdateTags={updateItemTags}
      />
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
          disabled={hasReferences}
          onDelete={deleteItemAction}
          FormInfo={<DeleteFormInfoSelector />}
        />
      )}
    </InfoPageWrapper>
  );
}

export default EditItemPage;
