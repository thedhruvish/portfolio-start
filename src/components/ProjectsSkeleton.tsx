import { Skeleton } from '@/components/ui/skeleton'

export const ProjectsSkeleton = () => {
  return (
    <ul className="flex flex-col gap-8">
      {[1, 2, 3].map((i) => (
        <li key={i} className="animate-pulse">
          <div className="py-4 space-y-4">
            {/* Title + Links */}
            <div className="flex items-center justify-between gap-4">
              <Skeleton className="h-8 w-2/3 md:w-1/2" />
              <div className="flex items-center gap-3">
                <Skeleton className="size-5 rounded-full" />
                <Skeleton className="size-5 rounded-full" />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>

            {/* Tech Stack */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {[1, 2, 3, 4].map((j) => (
                <Skeleton key={j} className="size-5 rounded-md" />
              ))}
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
