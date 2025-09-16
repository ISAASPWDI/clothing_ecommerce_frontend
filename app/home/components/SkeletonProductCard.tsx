import { Skeleton } from "@/components/ui/skeleton"

export default function SkeletonProductCard() {
  return (
    <div className="bg-white dark:bg-[#302f31] shadow-md dark:shadow-lg rounded-lg flex flex-col h-[543px] p-3">
      <Skeleton className="h-80 w-full rounded mb-4 bg-gray-200 dark:bg-[#3a393b]" />
      <div className="flex-grow flex flex-col justify-around">
        <div>
          <Skeleton className="h-5 w-3/4 mb-2 bg-gray-200 dark:bg-[#3a393b]" />
          <Skeleton className="h-5 w-1/2 bg-gray-200 dark:bg-[#3a393b]" />
        </div>
        <Skeleton className="h-10 w-full mt-4 rounded bg-gray-200 dark:bg-[#3a393b]" />
      </div>
    </div>
  );
}
