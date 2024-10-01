import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

function TriggerButton({ date }: { date?: Date }) {
  return (
    <PopoverTrigger asChild>
      <Button
        variant={"outline"}
        className={cn(
          "w-[240px] pl-3 text-left font-normal",
          !date && "text-muted-foreground",
        )}
      >
        {date ? format(date, "PPP") : "Select date"}
        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
      </Button>
    </PopoverTrigger>
  );
}

export default TriggerButton;
