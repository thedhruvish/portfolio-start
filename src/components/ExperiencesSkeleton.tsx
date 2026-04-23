import { Skeleton } from '@/components/ui/skeleton'

export const ExperiencesSkeleton = ({ count = 2 }: { count?: number }) => {
  return (
    <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
        >
          {/* Dot Skeleton */}
          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute left-0 md:left-1/2 -translate-x-1/2 md:translate-x-0">
            <Skeleton className="w-2 h-2 rounded-full" />
          </div>

          {/* Content Skeleton */}
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] py-4 ml-12 md:ml-0">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-5 w-24 rounded-full" />
              </div>
              <Skeleton className="h-5 w-32" />
              <div className="space-y-2 mt-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
