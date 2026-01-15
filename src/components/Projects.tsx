import { ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import Github from './svgs/Github'
import { Badge } from './ui/badge'
import { getPublicProjectsFn } from '@/functions/projects'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { TechIconsMap } from '@/config/tech-icons-map'

export const Projects = () => {
  const { data: projects } = useSuspenseQuery({
    queryKey: ['projects'],
    queryFn: () => getPublicProjectsFn(),
  })

  return (
    <section id="projects" className="mt-20 scroll-mt-24">
      {/* Section Header */}
      <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          Projects
        </h2>

        <Link
          to="/projects"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          View all projects →
        </Link>
      </div>

      {/* Project List */}
      <ul className="flex flex-col gap-8">
        {projects.map((project, index) => (
          <motion.li
            key={project.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <article className="group rounded-xl border bg-card/50 p-6 shadow-sm transition-all hover:shadow-md dark:hover:bg-muted/40">
              {/* Title + Links */}
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-xl font-semibold transition-colors group-hover:text-foreground md:text-2xl">
                  {project.title}
                </h3>

                <div className="flex items-center gap-3">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                      aria-label="GitHub Repository"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  )}
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                      aria-label="Live Project"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="mt-4 text-base text-muted-foreground">
                {project.description}
              </p>

              {/* Tech Stack (with Tooltips) */}
              {project.tech && project.tech.length > 0 && (
                <div className="mt-6 pt-4 border-t border-border/50">
                  <TooltipProvider>
                    <div className="flex flex-wrap items-center gap-3">
                      {project.tech.map((techName) => {
                        const Icon = TechIconsMap[techName]
                        return (
                          <Tooltip key={techName}>
                            <TooltipTrigger asChild>
                              <div className="size-5 cursor-default text-muted-foreground hover:text-foreground hover:scale-110 transition-all duration-300">
                                {Icon ? (
                                  <Icon />
                                ) : (
                                  <Badge
                                    variant="secondary"
                                    className="text-[10px] px-1 py-0 h-5"
                                  >
                                    {techName}
                                  </Badge>
                                )}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">{techName}</p>
                            </TooltipContent>
                          </Tooltip>
                        )
                      })}
                    </div>
                  </TooltipProvider>
                </div>
              )}
            </article>
          </motion.li>
        ))}
      </ul>
    </section>
  )
}
