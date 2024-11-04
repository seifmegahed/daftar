import SettingsProfilePage from "./profile";
import { setLocale } from "@/i18n/set-locale";

function SettingsPage({ params }: { params: { locale: Locale } }) {
  setLocale(params.locale);
  return <SettingsProfilePage />;
}

export default SettingsPage;
