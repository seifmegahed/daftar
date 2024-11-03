import { setLocale } from "@/i18n/set-locale";
import NewUserForm from "./form";

function NewUserPage({ params }: { params: { locale: Locale } }) {
  setLocale(params.locale);
  return <NewUserForm />;
}

export default NewUserPage;
