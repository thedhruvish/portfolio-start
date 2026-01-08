import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { checkAuthFn } from '@/functions/auth'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { CommandMenu } from '@/components/command-menu'
import { Separator } from '@/components/ui/separator'

export const Route = createFileRoute('/admin')({
  beforeLoad: async () => {
    const isAuth = await checkAuthFn()
    if (!isAuth) {
      throw redirect({ to: '/auth' })
    }
  },
  ssr: false, 
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="flex h-16 items-center gap-4 border-b px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-6" />
          <div className="flex-1">
            <h1 className="font-semibold text-lg">Admin Console</h1>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <CommandMenu />
          </div>
        </div>
        <div className="p-4">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  )
}
