import InfoPageWrapper from "@/components/info-page-wrapper";
import { getClientProjectsAction } from "@/server/actions/projects";

async function ClientProjectsPage({ params }: { params: { id: string } }) {
  const [projects, error] = await getClientProjectsAction(Number(params.id));

  if (error !== null) return <p>Error getting client&apos;s projects</p>;
  return (
    <InfoPageWrapper
      title="Client's Projects"
      subtitle="This is a list of the client's projects."
    >
      <pre>{JSON.stringify(projects, null, 2)}</pre>
    </InfoPageWrapper>
  );
}

export default ClientProjectsPage;
