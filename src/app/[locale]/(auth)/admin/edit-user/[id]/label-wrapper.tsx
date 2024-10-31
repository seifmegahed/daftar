import type { LabelProps } from "@radix-ui/react-label";
import { Label } from "@/components/ui/label";

const LabelWrapper = (
  props: {
    label: string;
  } & LabelProps,
) => (
  <Label className="text-lg" {...props}>
    {props.label}
  </Label>
);

export default LabelWrapper;
