import ProjectCard from "@/app/(auth)/projects/all-projects/project-card";
import InfoPageWrapper from "@/components/info-page-wrapper";
import { getSupplierProjectsAction } from "@/server/actions/projects/read";

async function SupplierProjectsPage({ params }: { params: { id: string } }) {
  const supplierId = Number(params.id);

  if (isNaN(supplierId)) return <p>Error: Supplier ID is not a number</p>;

  const [projects, error] = await getSupplierProjectsAction(supplierId);
  if (error !== null) return <p>Error: {error}</p>;
  return (
    <InfoPageWrapper
      title="Supplier's Projects"
      subtitle="This is a list of project that this supplier is involved in"
    >
      <div className="flex flex-col gap-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </InfoPageWrapper>
  );
}

export default SupplierProjectsPage;
