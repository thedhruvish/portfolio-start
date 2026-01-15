import { NewsletterForm } from './NewsletterForm'
import { Skeleton } from '@/components/ui/skeleton'
import Container from '@/components/Container'

export const BlogDetailSkeleton = () => {
  return (
    <Container className="py-10 max-w-4xl space-y-8 relative">
      {/* Desktop Back Button Skeleton */}
      <div className="hidden lg:block">
        <div className="absolute top-10 -left-20">
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>
      </div>

      {/* Mobile Back Button Skeleton */}
      <div className="lg:hidden mb-6">
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Hero Section Skeleton */}
      <div className="space-y-6 text-center flex flex-col items-center">
        <div className="flex items-center justify-center gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-12 w-1/2" />
        <div className="flex items-center justify-center gap-2 mt-4">
          <Skeleton className="h-4 w-40" />
        </div>
      </div>

      {/* Featured Image Skeleton */}
      <Skeleton className="aspect-video w-full rounded-xl" />

      {/* Content Skeleton */}
      <div className="space-y-4 max-w-none">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-32 w-full rounded-lg" /> {/* Block simulation */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <div className="py-8">
        <NewsletterForm />
      </div>
    </Container>
  )
}
