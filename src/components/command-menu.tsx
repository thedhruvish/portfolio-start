import { useEffect, useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { 
  LogOut, 
  FileText, 
  FolderGit2, 
  Hash, 
  Home, 
  Briefcase, 
  Mail, 
  Search,
  LayoutDashboard,
  User,
  MessageCircle,
  Newspaper
} from 'lucide-react'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'
import { logoutFn } from '@/functions/auth'
import { getPublicBlogsFn, getPublicTagsFn } from '@/functions/blogs'
import { getPublicProjectsFn } from '@/functions/projects'
import { navItems as adminNavItems } from './app-sidebar'

const staticPages = [
  { title: 'Home', url: '/', icon: Home },
  { title: 'Projects', url: '/projects', icon: FolderGit2 },
  { title: 'Blogs', url: '/blogs', icon: Newspaper },
  { title: 'Tags', url: '/tags', icon: Hash },
  { title: 'Contact', url: '/contact-us', icon: Mail },
]

export function CommandMenu() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const { data: blogs } = useQuery({
    queryKey: ['public-blogs-minimal'],
    queryFn: () => getPublicBlogsFn({ data: { pageSize: 50 } }),
    enabled: open
  })

  const { data: projects } = useQuery({
    queryKey: ['public-projects-minimal'],
    queryFn: () => getPublicProjectsFn(),
    enabled: open
  })

  const { data: tags } = useQuery({
    queryKey: ['public-tags-minimal'],
    queryFn: () => getPublicTagsFn(),
    enabled: open
  })

  const runCommand = (command: () => void) => {
    setOpen(false)
    command()
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 rounded-md border border-input bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        <span className="flex-1 text-left">Search...</span>
        <kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 hidden sm:inline-flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          
          <CommandGroup heading="Pages">
            {staticPages.map((page) => (
              <CommandItem
                key={page.url}
                value={page.title}
                onSelect={() => runCommand(() => router.navigate({ to: page.url }))}
              >
                <page.icon className="mr-2 h-4 w-4" />
                <span>{page.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          {blogs?.data && blogs.data.length > 0 && (
            <CommandGroup heading="Blogs">
              {blogs.data.map((blog) => (
                <CommandItem
                  key={blog.id}
                  value={blog.title}
                  onSelect={() => runCommand(() => router.navigate({ 
                    to: '/blogs/$slug',
                    params: { slug: blog.slug }
                  }))}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  <span>{blog.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {projects && projects.length > 0 && (
            <CommandGroup heading="Projects">
              {projects.map((project) => (
                <CommandItem
                  key={project.id}
                  value={project.title}
                  onSelect={() => runCommand(() => router.navigate({ to: '/projects' }))}
                >
                  <FolderGit2 className="mr-2 h-4 w-4" />
                  <span>{project.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {tags && tags.length > 0 && (
            <CommandGroup heading="Tags">
              {tags.map((tag) => (
                <CommandItem
                  key={tag}
                  value={tag}
                  onSelect={() => runCommand(() => router.navigate({ 
                    to: '/tags/$name',
                    params: { name: tag }
                  }))}
                >
                  <Hash className="mr-2 h-4 w-4" />
                  <span>{tag}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          <CommandSeparator />

          <CommandGroup heading="Admin">
            {adminNavItems.map((item) => (
              <CommandItem
                key={item.url}
                value={`Admin ${item.title}`}
                onSelect={() => runCommand(() => router.navigate({ to: item.url }))}
              >
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
              </CommandItem>
            ))}
            <CommandItem onSelect={() => runCommand(() => logoutFn())}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
