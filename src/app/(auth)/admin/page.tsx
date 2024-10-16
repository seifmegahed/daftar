import Pagination from "@/components/pagination";
import { defaultPageLimit } from "@/data/config";
import { getAllUsersAction, getUsersCountAction } from "@/server/actions/users";
import AllUsersList from "./all-users";
import { Suspense } from "react";
import { UsersListSkeleton } from "./loading";
import ListPageWrapper from "@/components/list-page-wrapper";
import ErrorPage from "@/components/error";

export const dynamic = "force-dynamic";

const pageLimit = 10;

async function AdminPage({ searchParams }: { searchParams: { page: string } }) {
  const pageParam = parseInt(searchParams.page);
  const page = isNaN(pageParam) ? 1 : pageParam;

  const [users, error] = await getAllUsersAction(page, defaultPageLimit);
  if (error !== null) return <ErrorPage message={error} />;

  const [totalCount, countError] = await getUsersCountAction();
  if (countError) return <ErrorPage message={countError} />;

  const totalPages = Math.ceil((totalCount ?? 1) / pageLimit);

  return (
    <ListPageWrapper title="Users" pagination={{ totalPages }}>
      <Suspense fallback={<UsersListSkeleton count={defaultPageLimit} />}>
        <AllUsersList users={users} />
      </Suspense>
    </ListPageWrapper>
  );
}

export default AdminPage;
