import {
  Await,
  Link,
  createFileRoute,
  defer,
  notFound,
} from '@tanstack/react-router'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Calendar, ChevronLeft } from 'lucide-react'
import { Suspense } from 'react'
import { BlockEditor } from '@/components/block-editor'
import { BlogCard } from '@/components/BlogCard'
import { BlogDetailSkeleton } from '@/components/BlogDetailSkeleton'
import { BlogLikeButton } from '@/components/BlogLikeButton'
import Container from '@/components/Container'
import { NewsletterForm } from '@/components/NewsletterForm'
import { EnhancedImage } from '@/components/enhanced-image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getPublicBlogBySlugFn } from '@/functions/blogs'

dayjs.extend(relativeTime)

export const Route = createFileRoute('/_web/blogs/$slug')({
  component: BlogDetailComponent,
  loader: ({ params: { slug } }) => {
    return {
      blog: defer(getPublicBlogBySlugFn({ data: slug })),
    }
  },
})

function BlogDetailComponent() {
  const { blog } = Route.useLoaderData()

  return (
    <Suspense fallback={<BlogDetailSkeleton />}>
      <Await promise={blog}>
        {(data) => {
          if (!data) throw notFound()

          return (
            <Container
              key={data.id}
              className="py-10 max-w-4xl space-y-8 relative"
            >
              <div className="hidden lg:block">
                <div className="absolute top-10 -left-20">
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="rounded-full h-12 w-12 hover:bg-muted/80 backdrop-blur-sm"
                  >
                    <Link to="/blogs" aria-label="Back to blogs">
                      <ChevronLeft className="w-6 h-6" />
                    </Link>
                  </Button>
                </div>

                <div className="absolute top-10 -right-20">
                  <BlogLikeButton
                    blogId={data.id}
                    initialLikes={data.likes || 0}
                  />
                </div>
              </div>
              {/* Mobile: Back Button & Like Button Row */}
              <div className="lg:hidden mb-6 flex items-center justify-between">
                <Button
                  variant="ghost"
                  asChild
                  className="-ml-4 gap-1 text-muted-foreground"
                >
                  <Link to="/blogs">
                    <ChevronLeft className="w-4 h-4" />
                    Back to Blogs
                  </Link>
                </Button>
                <BlogLikeButton
                  blogId={data.id}
                  initialLikes={data.likes || 0}
                />
              </div>
              {/* Hero Section */}
              <div className="space-y-6 text-center">
                <div className="flex items-center justify-center gap-2">
                  {data.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl text-balance">
                  {data.title}
                </h1>
                {data.createdAt && (
                  <div className="flex items-center justify-center text-muted-foreground text-sm gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Published {dayjs(data.createdAt).format('MMMM D, YYYY')}
                    </span>
                    <span>•</span>
                    <span>{dayjs(data.createdAt).fromNow()}</span>
                  </div>
                )}
              </div>
              {/* Featured Image */}
              {data.thumbImage && (
                <EnhancedImage
                  src={data.thumbImage}
                  alt={data.title}
                  className="aspect-video border shadow-sm rounded-xl overflow-hidden"
                />
              )}
              {/* Content */}
              <div className="prose prose-lg dark:prose-invert mx-auto max-w-none">
                <BlockEditor
                  value={data.content}
                  readOnly={true}
                  className="border-none p-0 min-h-0 bg-transparent"
                />
              </div>
              <hr className="border-border/50" />

              {/* Like Section */}
              <div className="flex flex-col items-center justify-center gap-4 py-8">
                <p className="text-muted-foreground font-medium">
                  Enjoyed this post? Give it some love!
                </p>
                <BlogLikeButton
                  blogId={data.id}
                  initialLikes={data.likes || 0}
                />
              </div>
              <hr className="border-border/50" />
              {/* Suggested Blogs */}
              {data.suggestions.length > 0 && (
                <div className="space-y-8 py-8">
                  <h3 className="text-2xl font-bold tracking-tight">
                    You might also like
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.suggestions.map((suggestion) => (
                      <BlogCard key={suggestion.id} blog={suggestion} />
                    ))}
                  </div>
                </div>
              )}
              {/* Newsletter */}
              <div className="py-8">
                <NewsletterForm />
              </div>
            </Container>
          )
        }}
      </Await>
    </Suspense>
  )
}
