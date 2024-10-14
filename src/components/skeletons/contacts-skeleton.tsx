import { AddressCardSkeleton } from "./addresses-skeleton";
import ListPageWrapperSkeleton from "./list-page-wrapper-skeleton";

function ContactsSkeleton() {
  return (
    <ListPageWrapperSkeleton subtitle>
      <AddressCardSkeleton />
      <AddressCardSkeleton />
      <AddressCardSkeleton />
    </ListPageWrapperSkeleton>
  );
}

export default ContactsSkeleton;
