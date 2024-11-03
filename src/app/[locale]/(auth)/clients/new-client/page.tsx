import { setLocale } from "@/i18n/set-locale";
import NewClientForm from "./form";

function NewClientPage({ params }: { params: { locale: Locale } }) {
  setLocale(params.locale);
  return <NewClientForm />;
}

export default NewClientPage;
