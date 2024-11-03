import ChangeNameSection from "./change-name-section";
import ChangePasswordSection from "./change-password-section";
import ChangeRoleSection from "./change-role-section";
import ActivateDeactivateUserSection from "./activate-deactivate-user-section";
import InfoPageWrapper from "@/components/info-page-wrapper";
import { getUserByIdAction } from "@/server/actions/users";
import ErrorPage from "@/components/error";
import ChangeEmailSection from "./change-email-section";
import ChangePhoneNumberSection from "./change-phone-number-section";
import { setLocale } from "@/i18n/set-locale";
import { getTranslations } from "next-intl/server";

async function EditUserPage({
  params,
}: {
  params: { id: string; locale: Locale };
}) {
  setLocale(params.locale);
  const t = await getTranslations("edit-user.page");

  const id = parseInt(params.id);
  if (isNaN(id)) return <ErrorPage message={t("invalid-id")} />;

  const [userData, error] = await getUserByIdAction(id);
  if (error !== null) return <ErrorPage message={error} />;

  return (
    <InfoPageWrapper
      title={t("title")}
      subtitle={t("subtitle", { userName: userData.name })}
    >
      <ChangeNameSection userId={userData.id} name={userData.name} />
      <ChangeEmailSection
        userId={userData.id}
        email={userData.email ?? ""}
        type="admin"
      />
      <ChangePhoneNumberSection
        userId={userData.id}
        phoneNumber={userData.phoneNumber ?? ""}
        type="admin"
      />
      <ChangeRoleSection userId={userData.id} userRole={userData.role} />
      <ChangePasswordSection userId={userData.id} />
      <ActivateDeactivateUserSection
        userId={userData.id}
        userActive={userData.active}
      />
    </InfoPageWrapper>
  );
}

export default EditUserPage;
