import { Outlet, createFileRoute } from '@tanstack/react-router'
import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/navbar'

export const Route = createFileRoute('/_web')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Navbar className="top-2" />
      <Outlet />
      <Footer />
    </>
  )
}
