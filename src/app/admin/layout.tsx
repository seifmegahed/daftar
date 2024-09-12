function AdminTopBar() {
  return (
    <div className="flex w-full justify-between bg-primary p-5 text-primary-foreground">
      <h1 className="text-3xl font-bold">Daftar Admin</h1>
    </div>
  );
}

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col justify-center gap-5">
      <AdminTopBar />
      {children}
    </div>
  );
}

export default AdminLayout;
