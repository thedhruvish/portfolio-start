import { ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import Github from './svgs/Github'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { projectList } from '@/config/projects'

export const Projects = () => {
  const projects = projectList
  return (
    <section className="mt-20">
      {/* Section Header */}
      <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          Projects
        </h2>

        {/* <a
          href="/projects"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          View all projects →
        </a> */}
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
                <TooltipProvider>
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    {project.tech.map(({ name, icon: Icon }, idx) => (
                      <Tooltip key={idx}>
                        <TooltipTrigger asChild>
                          <div className="size-6 hover:scale-110 transition-transform duration-300 cursor-pointer">
                            <Icon />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-sm">{name}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </TooltipProvider>
              )}
            </article>
          </motion.li>
        ))}
      </ul>
    </section>
  )
}
