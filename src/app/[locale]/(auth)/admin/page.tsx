import { defaultPageLimit } from "@/data/config";
import { getAllUsersAction, getUsersCountAction } from "@/server/actions/users";
import AllUsersList from "./all-users";
import { Suspense } from "react";
import { UsersListSkeleton } from "./loading";
import ListPageWrapper from "@/components/list-page-wrapper";
import ErrorPage from "@/components/error";

const pageLimit = 10;

async function AdminPage({ searchParams }: { searchParams: { page?: string } }) {
  const pageParam = parseInt(searchParams.page ?? "1");
  const page = isNaN(pageParam) ? 1 : pageParam;

  const [users, error] = await getAllUsersAction(page, defaultPageLimit);
  if (error !== null) return <ErrorPage message={error} />;
  if (!users.length)
    return (
      <ErrorPage
        title="There seems to be no users yet"
        message="Start adding users to be able to see them here."
      />
    );

  const [count, countError] = await getUsersCountAction();
  if (countError !== null) return <ErrorPage message={countError} />;

  const totalPages = Math.ceil(count / pageLimit);

  return (
    <ListPageWrapper title="Users" pagination={{ totalPages }}>
      <Suspense fallback={<UsersListSkeleton count={defaultPageLimit} />}>
        <AllUsersList users={users} />
      </Suspense>
    </ListPageWrapper>
  );
}

export default AdminPage;
