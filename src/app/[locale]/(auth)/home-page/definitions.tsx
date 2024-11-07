import { getTranslations } from "next-intl/server";
import { MainListItem, Notes, SubList } from "./utils";
import { Separator } from "@/components/ui/separator";

async function Definitions() {
  const t = await getTranslations("home-page.definitions");

  const userRoles = [
    {
      title: t("users.roles.admin.title"),
      text: t("users.roles.admin.description"),
    },
    {
      title: t("users.roles.super-user.title"),
      text: t("users.roles.super-user.description"),
    },
    {
      title: t("users.roles.user.title"),
      text: t("users.roles.user.description"),
    },
  ];

  const notes = [t("document.notes.note-1"), t("document.notes.note-2")];

  const projectProperties = [
    {
      title: t("project.project-properties.project-owner.title"),
      text: t("project.project-properties.project-owner.description"),
    },
    {
      title: t("project.project-properties.client.title"),
      text: t("project.project-properties.client.description"),
    },
    {
      title: t("project.project-properties.purchase-items.title"),
      text: t("project.project-properties.purchase-items.description"),
    },
    {
      title: t("project.project-properties.sale-items.title"),
      text: t("project.project-properties.sale-items.description"),
    },
    {
      title: t("project.project-properties.commercial-offer.title"),
      text: t("project.project-properties.commercial-offer.description"),
    },
    {
      title: t("project.project-properties.comments.title"),
      text: t("project.project-properties.comments.description"),
    },
  ];

  const definitionSections = [
    {
      title: t("users.title"),
      description: t("users.description"),
      children: <SubList items={userRoles} />,
    },
    {
      title: t("document.title"),
      description: t("document.description"),
      children: <Notes notes={notes} />,
    },
    {
      title: t("item.title"),
      description: t("item.description"),
    },
    {
      title: t("client.title"),
      description: t("client.description"),
    },
    {
      title: t("supplier.title"),
      description: t("supplier.description"),
    },
    {
      title: t("project.title"),
      description: t("project.description"),
      children: <SubList items={projectProperties} />,
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold">{t("title")}</h2>
      <Separator className="my-2" />
      <ul className="ms-4 list-disc space-y-8">
        {definitionSections.map((item) => (
          <MainListItem
            key={item.title}
            title={item.title}
            description={item.description}
          >
            {item.children}
          </MainListItem>
        ))}
      </ul>
    </div>
  );
}

export default Definitions;
