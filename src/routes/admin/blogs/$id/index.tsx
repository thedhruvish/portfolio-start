import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { Calendar, ChevronLeft } from 'lucide-react'
import dayjs from 'dayjs'
import { getBlogFn } from '@/functions/admin'
import { BlockEditor } from '@/components/block-editor'
import Container from '@/components/Container'
import { EnhancedImage } from '@/components/enhanced-image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/admin/blogs/$id/')({
  loader: async ({ params: { id } }) => {
    const blog = await getBlogFn({ data: Number(id) })
    if (!blog) throw notFound()
    return { blog }
  },
  component: BlogPreviewPage,
})

function BlogPreviewPage() {
  const { blog } = Route.useLoaderData()

  if (!blog) return null

  return (
    <Container className="py-10 max-w-4xl space-y-8 relative">
      <div className="hidden lg:block">
        <div className="absolute top-10 -left-20">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="rounded-full h-12 w-12 hover:bg-muted/80 backdrop-blur-sm"
          >
            <Link to="/admin/blogs" aria-label="Back to blogs">
              <ChevronLeft className="w-6 h-6" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Mobile: Back Button Row */}
      <div className="lg:hidden mb-6 flex items-center justify-between">
        <Button
          variant="ghost"
          asChild
          className="-ml-4 gap-1 text-muted-foreground"
        >
          <Link to="/admin/blogs">
            <ChevronLeft className="w-4 h-4" />
            Back to Blogs
          </Link>
        </Button>
      </div>

      {!blog.published && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-r">
          <p className="font-bold">Unpublished</p>
          <p>This blog post is currently not published.</p>
        </div>
      )}

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
            <span>Created {dayjs(blog.createdAt).format('MMMM D, YYYY')}</span>
          </div>
        )}
      </div>

      {/* Featured Image */}
      {blog.thumbImage && (
        <EnhancedImage
          src={blog.thumbImage}
          alt={blog.title}
          className="aspect-video border shadow-sm rounded-xl overflow-hidden"
        />
      )}

      {/* Content */}
      <div className="prose prose-lg dark:prose-invert mx-auto max-w-none">
        <BlockEditor
          value={blog.content}
          readOnly={true}
          className="border-none p-0 min-h-0 bg-transparent"
        />
      </div>
    </Container>
  )
}
