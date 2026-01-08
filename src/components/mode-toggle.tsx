import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from '@/provider/theme-provider'
import { Button } from '@/components/ui/button'

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-[1.2rem] w-[1.2rem] bg-transparent hover:bg-transparent text-black dark:text-white border-0 ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer"
    >
      {theme === 'light' && <Sun className="h-[1.2rem] w-[1.2rem]" />}
      {theme === 'dark' && <Moon className="h-[1.2rem] w-[1.2rem]" />}
      {theme === 'system' && <Monitor className="h-[1.2rem] w-[1.2rem]" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
