import { Link, createFileRoute } from '@tanstack/react-router'
import { BlogForm } from '@/components/blog-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import { getPublicTagsFn } from '@/functions/blogs'

export const Route = createFileRoute('/admin/blogs/new')({
  loader: async () => {
    const tags = await getPublicTagsFn()
    return { tags }
  },
  component: NewBlogPage,
})

function NewBlogPage() {
  const { tags } = Route.useLoaderData()
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Create Blog</h2>
        <div className="flex gap-2">
          <Button variant={'outline'} asChild>
            <Link to="/admin/blogs">Back</Link>
          </Button>
          <Button form="create-blog-form" type="submit">
            Create Blog
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>New Blog Post</CardTitle>
        </CardHeader>
        <CardContent>
          <BlogForm
            suggestions={tags}
            id="create-blog-form"
            hideSubmit={true}
          />
        </CardContent>
      </Card>
    </div>
  )
}
