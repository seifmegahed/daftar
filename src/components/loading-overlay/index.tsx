import Loading from "@/components/loading";

function LoadingOverlay(props: { state: boolean }) {
  if (!props.state) return null;
  return (
    <div className="absolute z-50 flex h-full w-full items-center justify-center bg-white/50">
      <Loading />
    </div>
  );
}

export default LoadingOverlay;
