import { Skeleton } from '@/components/ui/skeleton'

export const ExperiencesSkeleton = ({ count = 2 }: { count?: number }) => {
  return (
    <div className="relative space-y-0 before:absolute before:inset-0 before:left-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-border/50 before:via-border before:to-transparent">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="relative flex items-start group">
          {/* Dot Skeleton */}
          <div className="absolute left-5 -translate-x-1/2 flex items-center justify-center w-8 h-8 rounded-full border border-border bg-background shadow shrink-0 z-10 mt-1">
            <Skeleton className="w-2 h-2 rounded-full" />
          </div>

          {/* Content Skeleton */}
          <div className="flex-1 ml-12 pb-10">
            <div className="flex flex-col gap-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-5 w-24 rounded-full" />
              </div>
              <Skeleton className="h-5 w-32" />
              <div className="space-y-2 mt-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
