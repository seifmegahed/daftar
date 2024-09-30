import AllProjectsPage from "./all-projects";

function ProjectsPage({ searchParams }: { searchParams: { page: string } }) {
  const page = Number(searchParams.page);

  return <AllProjectsPage page={page || 1} />;
}

export default ProjectsPage;
