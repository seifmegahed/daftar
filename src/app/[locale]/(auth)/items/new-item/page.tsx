import { setLocale } from "@/i18n/set-locale";
import NewItemForm from "./form";

function NewItemPage({ params }: { params: { locale: Locale } }) {
  setLocale(params.locale);
  return <NewItemForm />;
}

export default NewItemPage;
