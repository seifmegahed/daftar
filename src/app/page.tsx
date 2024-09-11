import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main>
      <div className="flex w-full justify-between p-5">
        <h1 className="text-3xl font-bold">Daftar</h1>
        <Button>Logout</Button>
      </div>
    </main>
  );
}
