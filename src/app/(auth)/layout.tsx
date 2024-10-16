import TopNav from "@/components/nav/top-nav";
import PageContainer from "@/components/page-container";

function AuthenticatedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screens flex w-full flex-col">
      <TopNav />
      <PageContainer>
        {children}
        </PageContainer>
    </div>
  );
}

export default AuthenticatedLayout;
