import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_web/blogs/$slug')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_web/blogs/$slug"!</div>
}
