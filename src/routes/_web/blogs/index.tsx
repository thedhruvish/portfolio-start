import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_web/blogs/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_web/blog/"!</div>
}
