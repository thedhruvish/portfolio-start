import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_web/contact')({
  loader: () => {
    throw redirect({
      to: '/contact-us',
    })
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Redirect</div>
}
