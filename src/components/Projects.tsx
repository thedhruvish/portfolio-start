import { ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from '@tanstack/react-router'
import Github from './svgs/Github'
import { Badge } from './ui/badge'
import type { Project } from '@/db/schema/projects'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { TechIconsMap } from '@/config/tech-icons-map'
import { cn } from '@/lib/utils'

interface ProjectsProps {
  projects: Array<Project>
  selectedTech?: string | null
  onTechSelect?: (tech: string | null) => void
}

export const Projects = ({ projects, selectedTech, onTechSelect }: ProjectsProps) => {
  return (
    <ul className="flex flex-col gap-12">
      {projects.map((project, index) => (
        <motion.li
          key={project.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
        >
          <article className="group flex flex-col md:flex-row gap-8 items-start">
            {/* Content Side */}
            <div className="flex-1 order-2 md:order-1 space-y-4">
              {/* Title + Links */}
              <div className="flex items-center justify-between gap-4">
                <Link 
                  to="/projects/$slug" 
                  params={{ slug: project.slug }}
                  className="group/title"
                >
                  <h3 className="text-xl font-bold transition-colors group-hover:text-primary group-hover/title:text-primary md:text-2xl">
                    {project.title}
                  </h3>
                </Link>

                <div className="flex items-center gap-3">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground transition-colors hover:text-foreground p-2 hover:bg-muted rounded-full"
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
                      className="text-muted-foreground transition-colors hover:text-foreground p-2 hover:bg-muted rounded-full"
                      aria-label="Live Project"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-base text-muted-foreground leading-relaxed">
                {project.description}
              </p>

              {/* Tech Stack (with Tooltips) */}
              {project.tech && project.tech.length > 0 && (
                <div className="pt-2">
                  <TooltipProvider>
                    <div className="flex flex-wrap items-center gap-3">
                      {project.tech.map((techName: string) => {
                        const Icon = TechIconsMap[techName]
                        const isSelected = selectedTech === techName
                        return (
                          <Tooltip key={techName}>
                            <TooltipTrigger asChild>
                              <div 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onTechSelect?.(isSelected ? null : techName)
                                }}
                                className={cn(
                                  "size-5 cursor-pointer text-muted-foreground hover:text-foreground hover:scale-110 transition-all duration-300",
                                  isSelected && "text-primary scale-110"
                                )}
                              >
                                {Icon ? (
                                  <Icon />
                                ) : (
                                  <Badge
                                    variant={isSelected ? "default" : "secondary"}
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

            {/* Image Side */}
            {project.image && (
              <Link 
                to="/projects/$slug" 
                params={{ slug: project.slug }}
                className="w-full md:w-2/5 order-1 md:order-2 shrink-0"
              >
                <div className="relative aspect-video overflow-hidden rounded-xl border border-border/50 bg-muted group-hover:border-primary/50 transition-colors shadow-sm">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            )}
          </article>
        </motion.li>
      ))}
    </ul>
  )
}
