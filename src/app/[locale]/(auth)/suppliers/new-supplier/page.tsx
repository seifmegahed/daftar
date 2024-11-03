import { setLocale } from "@/i18n/set-locale";
import NewSupplierForm from "./form";

function NewSupplierPage({ params }: { params: { locale: Locale } }) {
  setLocale(params.locale);
  return <NewSupplierForm />;
}

export default NewSupplierPage;
