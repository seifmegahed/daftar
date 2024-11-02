import { getLocalizedStatusLabel } from "@/data/lut";
import ProjectCardContextMenu from "./card-menu";
import CardWrapper from "@/components/card-wrapper";
import {
  CardBodyContainer,
  CardBodyEndContainer,
  CardBodyStartContainer,
  CardCreatedAtSection,
  CardIdSection,
  CardMenuContainer,
  CardNameSection,
  CardSection,
  CardSubtitleSection,
} from "@/components/card-sections";
import { getLocale, getTranslations } from "next-intl/server";

const ProjectCard = async ({
  project,
}: {
  project: {
    id: number;
    name: string;
    status: number;
    clientId: number;
    clientName: string;
    createdAt: Date;
  };
}) => {
  const locale = (await getLocale()) as "ar" | "en";
  const t = await getTranslations("project-card.tips");
  const statusLabel = getLocalizedStatusLabel(project.status, locale);
  return (
    <CardWrapper>
      <CardIdSection href={`/project/${project.id}`} id={project.id} />
      <CardBodyContainer>
        <CardBodyStartContainer>
          <CardNameSection
            name={project.name}
            href={`/project/${project.id}`}
          />
          <CardSubtitleSection
            subtitle={project.clientName}
            tip={t("client")}
            href={`/client/${project.clientId}`}
          />
        </CardBodyStartContainer>
        <CardBodyEndContainer>
          <CardSection text={statusLabel} tip={t("status")} />
          <CardCreatedAtSection date={project.createdAt} />
        </CardBodyEndContainer>
      </CardBodyContainer>
      <CardMenuContainer>
        <ProjectCardContextMenu projectId={project.id} />
      </CardMenuContainer>
    </CardWrapper>
  );
};

export default ProjectCard;
