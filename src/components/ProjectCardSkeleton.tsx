import { Skeleton } from '@/components/ui/skeleton'

export const ProjectCardSkeleton = ({ count = 4 }: { count?: number }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <li key={i} className="list-none h-full animate-pulse">
          <div className="h-full flex flex-col overflow-hidden">
            {/* Project Image Skeleton */}
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted">
              <Skeleton className="h-full w-full" />
            </div>

            <div className="py-6 flex flex-col grow space-y-4">
              {/* Header Skeleton */}
              <div className="flex items-start justify-between gap-4">
                <Skeleton className="h-7 w-2/3 md:w-1/2" />
                <div className="flex items-center gap-2 shrink-0">
                  <Skeleton className="size-8 rounded-full" />
                  <Skeleton className="size-8 rounded-full" />
                </div>
              </div>

              {/* Description Skeleton */}
              <div className="grow space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-1/2" />
              </div>

              {/* Tech Stack Skeleton */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {[1, 2, 3, 4, 5].map((j) => (
                  <Skeleton key={j} className="size-5 rounded-md" />
                ))}
              </div>
            </div>
          </div>
        </li>
      ))}
    </>
  )
}
