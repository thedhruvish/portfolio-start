import { Outlet, createFileRoute } from '@tanstack/react-router'
import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/navbar'
import Container from '@/components/Container'
import Taskbar from '@/components/Taskbar'

export const Route = createFileRoute('/_web')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Navbar className="top-2" />
      <Container>
        <Outlet />
      </Container>
      <Taskbar />
      <Footer />
    </>
  )
}
