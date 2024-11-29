import Loading from "@/components/loading";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SubmitButtonProps = ButtonProps & {
  loading?: boolean;
};

function SubmitButton(props: SubmitButtonProps) {
  const { loading, ...rest } = props;
  return (
    <Button
      {...rest}
      className={cn(props.className, "w-40")}
      variant={props.variant ?? "outline"}
    >
      {loading ? <Loading className="size-5" /> : props.children}
    </Button>
  );
}

export default SubmitButton;
