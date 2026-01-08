import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_web/projects/$slug')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_web/projects/slug"!</div>
}
