const PaginationWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center justify-center">
    <div className="flex justify-between gap-2 sm:gap-4">{children}</div>
  </div>
);

export default PaginationWrapper;
