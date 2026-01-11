import { createFileRoute, notFound } from '@tanstack/react-router'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Calendar } from 'lucide-react'
import { BlockEditor } from '@/components/block-editor'
import Container from '@/components/Container'
import { getPublicBlogBySlugFn } from '@/functions/blogs'
import { Badge } from '@/components/ui/badge'


export const Route = createFileRoute('/_web/blogs/$slug')({
  component: BlogDetailComponent,
  loader: async ({ params: { slug } }) => {
    const blog = await getPublicBlogBySlugFn({ data: slug })
    if (!blog) {
      throw notFound()
    }
    return blog
  },
})

function BlogDetailComponent() {
  const blog = Route.useLoaderData()

  return (
    <Container className="py-10 max-w-4xl space-y-8">
      {/* Hero Section */}
      <div className="space-y-6 text-center">
        <div className="flex items-center justify-center gap-2">
          {blog.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl text-balance">
          {blog.title}
        </h1>
        {blog.createdAt && (
          <div className="flex items-center justify-center text-muted-foreground text-sm gap-2">
            <Calendar className="w-4 h-4" />
            <span>
              Published {dayjs(blog.createdAt).format('MMMM D, YYYY')}
            </span>
            <span>•</span>
            <span>{dayjs(blog.createdAt).fromNow()}</span>
          </div>
        )}
      </div>

      {/* Featured Image */}
      {blog.thumbImage && (
        <div className="relative aspect-video w-full overflow-hidden rounded-xl border bg-muted shadow-sm">
          <img
            src={blog.thumbImage}
            alt={blog.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="prose prose-lg dark:prose-invert mx-auto max-w-none">
        <BlockEditor
          value={blog.content}
          readOnly={true}
          className="border-none p-0 min-h-0"
        />
      </div>
    </Container>
  )
}
