import { AppearanceForm } from "./appearance-form";
import InfoPageWrapper from "@/components/info-page-wrapper";

export default function SettingsAppearancePage() {
  return (
    <InfoPageWrapper
      title="Preferences"
      subtitle="Customize your app preferences."
    >
      <AppearanceForm />
    </InfoPageWrapper>
  );
}
