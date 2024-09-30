import { Button } from "@/components/ui/button";

const PaginationButton = ({
  page,
  disabled,
  onClick,
}: {
  page: number;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}) => {
  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      className="flex size-10 items-center justify-center rounded-full transition-all duration-500 ease-in-out hover:scale-110"
    >
      <div>{page}</div>
    </Button>
  );
};

export default PaginationButton;
