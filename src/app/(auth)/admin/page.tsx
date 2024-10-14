import Pagination from "@/components/pagination";
import { defaultPageLimit } from "@/data/config";
import { getAllUsersAction, getUsersCountAction } from "@/server/actions/users";
import AllUsersList from "./all-users";
import { Suspense } from "react";
import { UsersListSkeleton } from "./loading";
import ListPageWrapper from "@/components/list-page-wrapper";

export const dynamic = "force-dynamic";

async function AdminPage({ searchParams }: { searchParams: { page: string } }) {
  const page = isNaN(Number(searchParams.page)) ? 1 : Number(searchParams.page);

  const [users, error] = await getAllUsersAction(page, defaultPageLimit);
  const [totalPages, countError] = await getUsersCountAction();

  if (error !== null || countError !== null)
    return <p>Error: Could not load users</p>;
  return (
    <ListPageWrapper title="Users" pagination={{ totalPages }}>
      <Suspense fallback={<UsersListSkeleton count={defaultPageLimit} />}>
        <AllUsersList users={users} />
      </Suspense>
    </ListPageWrapper>
  );
}

export default AdminPage;
