import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export const BlogsSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <li key={i} className="h-full list-none">
          <Card className="h-full overflow-hidden border-border/50 bg-card/50">
            {/* Thumbnail Image Skeleton */}
            <div className="relative aspect-video w-full overflow-hidden bg-muted">
              <Skeleton className="h-full w-full" />
              {/* Date Badge Skeleton */}
              <div className="absolute top-4 right-4">
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            </div>

            <CardContent className="p-6 space-y-4">
              {/* Tags Skeleton */}
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>

              <div className="space-y-2">
                {/* Title Skeleton */}
                <Skeleton className="h-7 w-full" />
                <Skeleton className="h-7 w-3/4" />

                {/* Description Skeleton */}
                <div className="pt-2 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>

              {/* Read More Link Skeleton */}
              <div className="pt-2 flex items-center">
                <Skeleton className="h-5 w-24" />
              </div>
            </CardContent>
          </Card>
        </li>
      ))}
    </>
  )
}
