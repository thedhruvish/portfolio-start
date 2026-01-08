import { motion } from 'framer-motion'
import { Link } from '@tanstack/react-router'
import Github from './svgs/Github'
import Mail from './svgs/Mail'
import Container from './Container'
import LinkedIn from './svgs/LinkedIn'
import { CONFIG } from '@/config/config'

export const Footer = () => {
  return (
    <Container>
      <footer className="relative border-t bg-background/50 backdrop-blur-sm">
        <div className="relative flex items-center justify-center overflow-hidden py-24 md:py-40">
          <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-muted/10 to-transparent dark:via-muted/20" />

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: [1, 0.08, 0.05, 0.08],
              y: 0,
            }}
            transition={{
              duration: 1.5, // Initial fade-in
              opacity: {
                duration: 5,
                repeat: Infinity,
                repeatType: 'mirror',
                ease: 'easeInOut',
              },
            }}
            className="select-none text-center font-extrabold text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] text-foreground"
          >
            {CONFIG.name}
          </motion.h1>
        </div>

        <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-6 py-10 text-center text-sm text-muted-foreground md:flex-row md:text-left pb-32">
          <div>
            <p className="font-medium text-foreground">
              © {new Date().getFullYear()} {CONFIG.fullName}
            </p>
            <p className="text-muted-foreground">
              Building modern web & mobile experiences.
            </p>
          </div>

          {/* Middle: Nav Links */}
          <nav className="flex flex-wrap justify-center gap-4 md:gap-6">
            <Link to="/" className="transition-colors hover:text-foreground">
              Home
            </Link>
            <Link
              to="/blog"
              className="transition-colors hover:text-foreground"
            >
              Blog
            </Link>
            {/* <Link
            href="/about"
            className="transition-colors hover:text-foreground"
          >
            About
          </Link> */}
          </nav>

          {/* Right: Social Icons */}
          <div className="flex items-center gap-4">
            <a
              href={CONFIG.SOCIAL_MEDIA.github}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform hover:scale-110 hover:text-foreground"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href={`mailto:${CONFIG.SOCIAL_MEDIA.email}`}
              className="transition-transform hover:scale-110 hover:text-foreground"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
            <a
              href={CONFIG.SOCIAL_MEDIA.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform hover:scale-110 hover:text-foreground"
              aria-label="LinkedIn"
            >
              <LinkedIn className="h-5 w-5" />
            </a>
          </div>
        </div>
      </footer>
    </Container>
  )
}
