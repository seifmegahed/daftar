import ChangePasswordForm from "./change-password-form";
import { getCurrentUserAction } from "@/server/actions/users";
import InfoPageWrapper from "@/components/info-page-wrapper";
import ErrorPage from "@/components/error";
import ChangeNameSection from "@/app/[locale]/(auth)/admin/edit-user/[id]/change-name-section";
import ChangeEmailSection from "@/app/[locale]/(auth)/admin/edit-user/[id]/change-email-section";
import ChangePhoneNumberSection from "@/app/[locale]/(auth)/admin/edit-user/[id]/change-phone-number-section";
import {getTranslations} from "next-intl/server";
import { setLocale } from "@/i18n/set-locale";

async function SettingsAccountPage({ params }: { params: { locale: Locale } }) {
  setLocale(params.locale);
  const t = await getTranslations("settings.edit");

  const [currentUser, error] = await getCurrentUserAction();
  if (error !== null) return <ErrorPage message={error} />;

  return (
    <InfoPageWrapper title={t("title")} subtitle={t("subtitle")}>
      <ChangeNameSection name={currentUser.name} />
      <ChangeEmailSection
        userId={currentUser.id}
        email={currentUser.email ?? ""}
        type="user"
      />
      <ChangePhoneNumberSection
        userId={currentUser.id}
        phoneNumber={currentUser.phoneNumber ?? ""}
        type="user"
      />
      <ChangePasswordForm />
    </InfoPageWrapper>
  );
}

export default SettingsAccountPage;
