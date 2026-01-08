import { createFileRoute } from '@tanstack/react-router'
import { BlogForm } from '@/components/blog-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getBlogFn } from '@/functions/admin'

export const Route = createFileRoute('/admin/blogs/$id/edit')({
  loader: async ({ params: { id } }) => {
    const blog = await getBlogFn({ data: Number(id) })
    if (!blog) throw new Error('Blog not found')
    return { blog }
  },
  component: EditBlogPage,
})

function EditBlogPage() {
  const { blog } = Route.useLoaderData()

  const initialValues = {
    ...blog,
    description: blog.description || undefined,
    thumbImage: blog.thumbImage || undefined,
    published: blog.published || false,
    order: blog.order || 0,
    tags: blog.tags,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Edit Blog</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{blog.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <BlogForm initialValues={initialValues} />
        </CardContent>
      </Card>
    </div>
  )
}
