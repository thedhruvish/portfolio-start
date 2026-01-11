import { Outlet, createFileRoute } from '@tanstack/react-router'
import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/navbar'
import Container from '@/components/Container'
import Taskbar from '@/components/Taskbar'
import { getProfileFn } from '@/functions/admin'

export const Route = createFileRoute('/_web')({
  component: RouteComponent,
  loader: async () => await getProfileFn(),
})

function RouteComponent() {
  const profile = Route.useLoaderData()

  return (
    <>
      <Navbar className="top-2" />
      <Container>
        <Outlet />
      </Container>
      <Taskbar profile={profile} />
      <Footer />
    </>
  )
}
