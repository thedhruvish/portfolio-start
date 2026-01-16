import { Await, createFileRoute, defer } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { ExternalLink } from 'lucide-react'
import { Suspense } from 'react'
import Github from '@/components/svgs/Github'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { TechIconsMap } from '@/config/tech-icons-map'
import { getPublicProjectsFn } from '@/functions/projects'
import { ProjectCardSkeleton } from '@/components/ProjectCardSkeleton'

import { CONFIG } from '@/config/config'

export const Route = createFileRoute('/_web/projects/')({
  component: ProjectsPage,
  loader: () => {
    const projects = getPublicProjectsFn()
    return { projects: defer(projects) }
  },
  head: () => ({
    meta: [
      {
        title: `Projects | ${CONFIG.title}`,
        content: 'Check out my latest projects and open source contributions.',
      },
      {
        name: 'description',
        content: 'Check out my latest projects and open source contributions.',
      },
      {
        property: 'og:title',
        content: `Projects | ${CONFIG.title}`,
      },
      {
        property: 'og:description',
        content: 'Check out my latest projects and open source contributions.',
      },
      {
        property: 'og:image',
        content: CONFIG.profilePic,
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: `Projects | ${CONFIG.title}` },
      {
        name: 'twitter:description',
        content: 'Check out my latest projects and open source contributions.',
      },
      { name: 'twitter:image', content: CONFIG.profilePic },
    ],
  }),
})

function ProjectsPage() {
  const { projects } = Route.useLoaderData()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">
          All Projects
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          A collection of projects I've worked on, ranging from web applications
          to open source tools.
        </p>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Suspense fallback={<ProjectCardSkeleton count={4} />}>
          <Await promise={projects}>
            {(data) => (
              <>
                {data.map((project, index) => (
                  <motion.li
                    key={project.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className="h-full"
                  >
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 4,
                        ease: 'easeInOut',
                        delay: index * 0.2,
                      }}
                      className="group h-full flex flex-col rounded-xl border bg-card text-card-foreground shadow-lg overflow-hidden"
                    >
                      {/* Project Image */}
                      {project.image && (
                        <div className="relative aspect-video w-full overflow-hidden border-b border-border/50">
                          <img
                            src={project.image}
                            alt={project.title}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      )}

                      <div className="p-6 flex flex-col grow">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <h3 className="text-xl font-bold text-primary line-clamp-2">
                            {project.title}
                          </h3>

                          <div className="flex items-center gap-2 shrink-0">
                            {project.github && (
                              <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground p-2 bg-muted/50 rounded-full transition-colors"
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
                                className="text-muted-foreground hover:text-foreground p-2 bg-muted/50 rounded-full transition-colors"
                                aria-label="Live Project"
                              >
                                <ExternalLink className="h-5 w-5" />
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Description */}
                        <div className="grow">
                          <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed">
                            {project.description}
                          </p>
                        </div>

                        {/* Tech Stack */}
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
                      </div>
                    </motion.div>
                  </motion.li>
                ))}
              </>
            )}
          </Await>
        </Suspense>
      </ul>
    </div>
  )
}
