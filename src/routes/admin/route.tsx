import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { checkAuthFn } from '@/functions/auth'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'

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
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="p-4 flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="font-semibold text-lg">Admin Console</h1>
        </div>
        <div className="p-4">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  )
}
