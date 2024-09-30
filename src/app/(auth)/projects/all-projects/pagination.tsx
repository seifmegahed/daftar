import { Button } from "@/components/ui/button";
import Link from "next/link";

const Pagination = ({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) => {
  return (
    <div className="flex justify-between">
      <Link
        href={`/projects?page=${page === 1 ? page : page - 1}`}
        className={`${page === 1 ? "cursor-default" : "cursor-pointer"}`}
      >
        <Button className="w-32" disabled={page === 1}>
          Previous
        </Button>
      </Link>
      <Link
        href={`/projects?page=${page === totalPages ? page : page + 1}`}
        className={`${page === totalPages ? "cursor-default" : "cursor-pointer"}`}
      >
        <Button className="w-32" disabled={page === totalPages}>
          Next
        </Button>
      </Link>
    </div>
  );
};

export default Pagination;
