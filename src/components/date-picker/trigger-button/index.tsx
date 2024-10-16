import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

function TriggerButton({
  date,
  className,
}: {
  date?: Date;
  className?: string;
}) {
  return (
    <PopoverTrigger asChild>
      <Button
        variant={"outline"}
        className={cn(
          "w-[240px] pl-3 text-start font-normal",
          className,
          !date && "text-muted-foreground",
        )}
      >
        {date ? format(date, "PPP") : "Select date"}
        <CalendarIcon className="ms-auto h-4 w-4 text-muted-foreground" />
      </Button>
    </PopoverTrigger>
  );
}

export default TriggerButton;
