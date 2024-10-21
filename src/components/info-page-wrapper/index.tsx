import { Separator } from "@/components/ui/separator";

function InfoPageWrapper({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex flex-col gap-10 sm:p-0 px-3">
      <div className="flex flex-col gap-y-4">
        <h1 className="text-2xl font-bold">{title}</h1>
        <Separator />
        <p className="text-muted-foreground">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

export default InfoPageWrapper;
