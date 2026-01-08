import { Link } from '@tanstack/react-router'
import { cn } from '../lib/utils'
import { Menu } from './ui/navbar-menu'
import { ModeToggle } from './mode-toggle'

export const Navbar = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn('fixed top-10 inset-x-0 max-w-2xl mx-auto z-50', className)}
    >
      <Menu setActive={() => {}}>
        <Link
          to="/"
          className="cursor-pointer text-black hover:opacity-[0.9] dark:text-white"
        >
          Home
        </Link>
        <Link
          to="/projects"
          className="cursor-pointer text-black hover:opacity-[0.9] dark:text-white"
        >
          Project
        </Link>
        <Link
          to="/blogs"
          className="cursor-pointer text-black hover:opacity-[0.9] dark:text-white"
        >
          Blog
        </Link>
        <Link
          to="/contact-us"
          className="cursor-pointer text-black hover:opacity-[0.9] dark:text-white"
        >
          Contact
        </Link>
        <div className="flex items-center justify-center">
          <ModeToggle />
        </div>
      </Menu>
    </div>
  )
}
