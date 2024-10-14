function CardWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex sm:items-center gap-4 border-t p-4 last:border-b sm:rounded-xl sm:border h-full">
      {children}
    </div>
  );
}

export default CardWrapper;