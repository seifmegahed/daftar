import { getProjectBriefByIdAction } from "@/server/actions/projects";
import StatusForm from "./status-form";
import NameForm from "./name-form";
import DescriptionForm from "./description-form";
import {
  getAllUsersAction,
  getCurrentUserAction,
} from "@/server/actions/users";
import OwnerForm from "./owner-form";
import DatesForm from "./dates-form";
import NotesForm from "./notes-form";
import DeleteProjectForm from "./delete-project";

export const dynamic = "force-dynamic";

async function EditProjectPage({ params }: { params: { id: number } }) {
  const [project, error] = await getProjectBriefByIdAction(params.id);
  if (error !== null) return <div>Error getting project</div>;

  const [users, usersError] = await getAllUsersAction();
  const [currentUser, currentUserError] = await getCurrentUserAction();

  const hasFullAccess =
    currentUser?.role === "admin" ||
    currentUser?.id === project.ownerId ||
    false;

  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-2xl font-bold">Edit Project</h1>
      <p className="text-muted-foreground">
        In this page you can edit the project {project.name}. Here you can
        change the name, description, status, and more. Updating any field will
        update the project in all references. and will {" "}
        <strong>register you as the last updater.</strong>
      </p>
      <StatusForm projectId={project.id} status={project.status} />
      <NameForm projectId={project.id} name={project.name} access={hasFullAccess} ownerId={project.ownerId} />
      <DescriptionForm projectId={project.id} description={project.description ?? ""} />
      {usersError === null && currentUserError === null && (
        <OwnerForm
          projectId={project.id}
          ownerId={project.ownerId}
          users={users}
          access={hasFullAccess}
        />
      )}
      <DatesForm
        projectId={project.id}
        startDate={project.startDate ? new Date(project.startDate) : undefined}
        endDate={project.endDate ? new Date(project.endDate) : undefined}
      />
      <NotesForm projectId={project.id} notes={project.notes ?? ""} />
      <DeleteProjectForm name={project.name} access={hasFullAccess} />
    </div>
  );
}

export default EditProjectPage;
