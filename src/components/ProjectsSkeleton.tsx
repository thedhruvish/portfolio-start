import { Skeleton } from '@/components/ui/skeleton'

export const ProjectsSkeleton = () => {
  return (
    <ul className="flex flex-col gap-8">
      {[1, 2, 3].map((i) => (
        <li key={i}>
          <div className="rounded-xl border bg-card/50 p-6 shadow-sm">
            {/* Title + Links */}
            <div className="flex items-center justify-between gap-4">
              <Skeleton className="h-8 w-64" />
              <div className="flex items-center gap-3">
                <Skeleton className="size-5 rounded-full" />
                <Skeleton className="size-5 rounded-full" />
              </div>
            </div>

            {/* Description */}
            <div className="mt-4 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>

            {/* Tech Stack */}
            <div className="mt-6 pt-4 border-t border-border/50">
              <div className="flex flex-wrap items-center gap-3">
                {[1, 2, 3, 4].map((j) => (
                  <Skeleton key={j} className="size-5 rounded-md" />
                ))}
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
