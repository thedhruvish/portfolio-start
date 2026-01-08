import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { checkAuthFn } from '@/functions/auth'

export const Route = createFileRoute('/admin')({
  beforeLoad: async () => {
    const isAuth = await checkAuthFn()
    if (!isAuth) {
      throw redirect({ to: '/auth' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Outlet />
    </>
  )
}
