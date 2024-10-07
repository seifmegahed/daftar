import { getProjectBriefByIdAction } from "@/server/actions/projects/read";
import {
  updateProjectDescriptionAction,
  updateProjectNameAction,
  updateProjectNotesAction,
} from "@/server/actions/projects/update";
import {
  getAllUsersAction,
  getCurrentUserAction,
} from "@/server/actions/users";

import StatusForm from "./status-form";
import OwnerForm from "./owner-form";
import DatesForm from "./dates-form";

import NotesForm from "@/components/common-forms/update-notes-form";
import NameForm from "@/components/common-forms/update-name-form";
import DescriptionForm from "@/components/common-forms/update-description-form";
import InfoPageWrapper from "@/components/info-page-wrapper";
import DeleteForm from "@/components/common-forms/delete-form";
import { deleteProjectAction } from "@/server/actions/projects/delete";
import DeleteFormInfo from "@/components/common-forms/delete-form/DeleteFormInfo";

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
    <InfoPageWrapper
      title="Edit Project"
      subtitle={`This is the edit page for the project: ${project.name}. Here you can edit the project details.`}
    >
      <StatusForm projectId={project.id} status={project.status} />
      <NameForm
        id={project.id}
        type="project"
        updateCallbackActionWithOwner={updateProjectNameAction}
        name={project.name}
        access={hasFullAccess}
        ownerId={project.ownerId}
      />
      <DescriptionForm
        id={project.id}
        description={project.description ?? ""}
        updateCallbackAction={updateProjectDescriptionAction}
        type="project"
      />
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
      <NotesForm
        id={project.id}
        updateCallbackAction={updateProjectNotesAction}
        notes={project.notes ?? ""}
        type="project"
      />
      <DeleteForm
        name={project.name}
        access={hasFullAccess}
        type="project"
        id={project.id}
        onDelete={deleteProjectAction}
        formInfo={<DeleteFormInfo type="project" />}
      />
    </InfoPageWrapper>
  );
}

export default EditProjectPage;
