import { Skeleton } from "@/styles/vega/ui/skeleton"

export default function SkeletonPreview() {
  return (
    <div className="flex w-full items-center gap-4">
      <Skeleton className="size-10 shrink-0 rounded-full" />
      <div className="grid flex-1 gap-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  )
}
