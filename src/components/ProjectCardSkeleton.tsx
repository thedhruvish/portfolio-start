import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'

export const ProjectCardSkeleton = ({ count = 4 }: { count?: number }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <li key={i} className="list-none h-full">
          <Card className="h-full flex flex-col rounded-xl border bg-card text-card-foreground shadow-lg overflow-hidden">
            {/* Project Image Skeleton */}
            <div className="relative aspect-video w-full overflow-hidden border-b border-border/50 bg-muted">
              <Skeleton className="h-full w-full" />
            </div>

            <div className="p-6 flex flex-col grow gap-4">
              {/* Header Skeleton */}
              <div className="flex items-start justify-between gap-4">
                <Skeleton className="h-7 w-3/4" />
                <div className="flex items-center gap-2 shrink-0">
                  <Skeleton className="size-9 rounded-full" />
                  <Skeleton className="size-9 rounded-full" />
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
              <div className="mt-2 pt-4 border-start border-border/50">
                <div className="flex flex-wrap items-center gap-3">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <Skeleton key={j} className="size-5 rounded-md" />
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </li>
      ))}
    </>
  )
}
