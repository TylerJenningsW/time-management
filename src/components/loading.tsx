import { Spinner } from "@nextui-org/react";

function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center gap-4 p-16">
      Loading... <Spinner />
    </div>
  );
}
export default Loading