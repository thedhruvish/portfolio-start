import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/blogs')({
  component: AdminBlogs,
})

function AdminBlogs() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Blogs</h2>
      <p>Manage your blog posts here.</p>
    </div>
  )
}
