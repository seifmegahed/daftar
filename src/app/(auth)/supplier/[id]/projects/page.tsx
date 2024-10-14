import ProjectCard from "@/app/(auth)/projects/all-projects/project-card";
import ListPageWrapper from "@/components/list-page-wrapper";
import { getSupplierProjectsAction } from "@/server/actions/project-items/read";

async function SupplierProjectsPage({ params }: { params: { id: string } }) {
  const supplierId = Number(params.id);

  if (isNaN(supplierId)) return <p>Error: Supplier ID is not a number</p>;

  const [projects, error] = await getSupplierProjectsAction(supplierId);
  if (error !== null) return <p>Error: {error}</p>;
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
