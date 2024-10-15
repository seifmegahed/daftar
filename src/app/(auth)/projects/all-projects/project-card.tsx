import { getStatusLabel } from "@/data/lut";
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

const ProjectCard = ({
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
            tip="Client"
            href={`/client/${project.clientId}`}
          />
        </CardBodyStartContainer>
        <CardBodyEndContainer>
          <CardSection text={getStatusLabel(project.status)} tip="Status" />
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
