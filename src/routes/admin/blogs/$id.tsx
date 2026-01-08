import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/blogs/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/blogs/$id"!</div>
}
