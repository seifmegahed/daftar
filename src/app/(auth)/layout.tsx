import TopNav from "@/components/nav/top-nav";

function AuthenticatedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screens flex w-full flex-col">
      <TopNav />
      <main className="max-w-screen flex h-full w-full flex-col gap-4 p-4 md:gap-8 md:px-10">
        {children}
      </main>
    </div>
  );
}

export default AuthenticatedLayout;
