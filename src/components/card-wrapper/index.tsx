function CardWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 border-t p-4 last:border-b sm:rounded-xl sm:border">
      {children}
    </div>
  );
}

export default CardWrapper;