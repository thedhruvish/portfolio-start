import { Link } from '@tanstack/react-router'
import { cn } from '../lib/utils'
import { Menu } from './ui/navbar-menu'
import { ModeToggle } from './mode-toggle'

const navMenuList = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Projects',
    href: '/projects',
  },
  {
    title: 'Blogs',
    href: '/blogs',
  },
  {
    title: 'Contact',
    href: '/contact-us',
  },
] as const

export const Navbar = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        'fixed top-10 inset-x-0 max-w-2xl  mx-auto z-50',
        className,
      )}
    >
      <Menu   setActive={() => {}}>
        {navMenuList.map((item) => (
          <Link key={item.title} to={item.href} className="cursor-pointer">
            {item.title}
          </Link>
        ))}

        <div className="flex items-center justify-center">
          <ModeToggle />
        </div>
      </Menu>
    </div>
  )
}
