import { Separator } from "../ui/separator";

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <>
    <h2 className="text-xl font-bold tracking-tight">{title}</h2>
    <Separator />
    <div className="flex flex-col gap-y-2 text-muted-foreground">
      {children}
    </div>
  </>
);

export default Section;
