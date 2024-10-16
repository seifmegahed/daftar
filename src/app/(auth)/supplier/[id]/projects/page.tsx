import ProjectCard from "@/app/(auth)/projects/all-projects/project-card";
import ErrorPage from "@/components/error";
import ListPageWrapper from "@/components/list-page-wrapper";
import { getSupplierProjectsAction } from "@/server/actions/project-items/read";

async function SupplierProjectsPage({ params }: { params: { id: string } }) {
  const supplierId = parseInt(params.id);
  if (isNaN(supplierId)) return <ErrorPage message="Invalid supplier ID" />;

  const [projects, error] = await getSupplierProjectsAction(supplierId);
  if (error !== null) return <ErrorPage message={error} />;
  if (!projects.length)
    return (
      <ErrorPage title="There seems to be no projects linked to this supplier yet" />
    );
    
  return (
    <ListPageWrapper
      title="Supplier's Projects"
      subtitle="This is a list of project that this supplier is involved in"
    >
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </ListPageWrapper>
  );
}

export default SupplierProjectsPage;
