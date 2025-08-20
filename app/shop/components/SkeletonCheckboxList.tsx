import { Skeleton } from "@/components/ui/skeleton"

type SkeletonCheckboxListProps = {
  count?: number // cuántos checkboxes "falsos" mostrar
}

export default function SkeletonCheckboxList({ count = 5 }: SkeletonCheckboxListProps) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4 rounded" /> {/* cuadradito checkbox */}
          <Skeleton className="h-4 w-[70px]" />   {/* label simulado */}
        </div>
      ))}
    </div>
  )
}
