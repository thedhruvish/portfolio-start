import { Link } from '@tanstack/react-router'
import {
  Command,
  FolderGit2,
  LayoutDashboard,
  LogOut,
  Mail,
  MessageCircle,
  Newspaper,
  User,
} from 'lucide-react'

import { ModeToggle } from '@/components/mode-toggle'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { logoutFn } from '@/functions/auth'

export const navItems = [
  {
    title: 'Dashboard',
    url: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Profile',
    url: '/admin/profile',
    icon: User,
  },
  {
    title: 'Projects',
    url: '/admin/projects',
    icon: FolderGit2,
  },
  {
    title: 'Blogs',
    url: '/admin/blogs',
    icon: Newspaper,
  },
  {
    title: 'Subscribers',
    url: '/admin/subscribers',
    icon: Mail,
  },
  {
    title: 'Contact Us',
    url: '/admin/contacts',
    icon: MessageCircle,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-4">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Command className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Admin Panel</span>
            <span className="truncate text-xs">Manage Content</span>
          </div>
          <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => logoutFn()}
            className="h-[1.2rem] w-[1.2rem]"
          >
            <LogOut className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.url}
                      activeProps={{ className: 'bg-accent font-medium' }}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={() => logoutFn()}
        >
          <LogOut className="size-4" />
          <span>Logout</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
