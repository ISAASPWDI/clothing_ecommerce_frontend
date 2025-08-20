import { Skeleton } from "@/components/ui/skeleton"

type SkeletonCategoryPillsProps = {
  count?: number // número de pills a renderizar
}

export default function SkeletonCategoryPills({ count = 6 }: SkeletonCategoryPillsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-8 w-20 rounded-full" // simula el botón pill
        />
      ))}
    </div>
  )
}
