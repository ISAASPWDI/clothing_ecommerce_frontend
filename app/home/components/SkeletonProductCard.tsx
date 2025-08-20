import { Skeleton } from "@/components/ui/skeleton"

export default function SkeletonProductCard() {
  return (
    <div className="bg-white shadow-md rounded-lg flex flex-col h-[543px] p-3">
      <Skeleton className="h-80 w-full rounded mb-4" />
      <div className="flex-grow flex flex-col justify-between">
        <div>
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-5 w-1/2" />
        </div>
        <Skeleton className="h-10 w-full mt-4 rounded" />
      </div>
    </div>
  );
}
