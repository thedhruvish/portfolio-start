import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import Github from '@/components/svgs/Github'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ProjectCardProps {
  project: {
    title: string
    description: string
    image?: string
    github?: string
    link?: string
    tech?: Array<{
      name: string
      icon: React.ComponentType
    }>
  }
  className?: string
  index?: number
}

export const ProjectCard = ({
  project,
  className,
  index = 0,
}: ProjectCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card
        className={cn(
          'h-full overflow-hidden border-border/50 bg-card/50 hover:bg-card/80 hover:shadow-lg transition-all duration-300 flex flex-col group',
          className,
        )}
      >
        {/* Project Image */}
        <div className="relative aspect-video w-full overflow-hidden bg-muted border-b border-border/50">
          {project.image ? (
            <img
              src={project.image}
              alt={project.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-secondary text-secondary-foreground">
              <span className="text-4xl font-bold opacity-20">Project</span>
            </div>
          )}
        </div>

        <div className="p-6 flex flex-col flex-grow">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <h3 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors line-clamp-2">
              {project.title}
            </h3>

            <div className="flex items-center gap-2 shrink-0">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground p-2 hover:bg-muted rounded-full transition-colors"
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
                  className="text-muted-foreground hover:text-foreground p-2 hover:bg-muted rounded-full transition-colors"
                  aria-label="Live Project"
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="flex-grow">
            <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Tech Stack */}
          {project.tech && project.tech.length > 0 && (
            <div className="mt-6 pt-4 border-t border-border/50">
              <TooltipProvider>
                <div className="flex flex-wrap items-center gap-3">
                  {project.tech.map(({ name, icon: Icon }, idx) => (
                    <Tooltip key={idx}>
                      <TooltipTrigger asChild>
                        <div className="size-5 cursor-pointer text-muted-foreground hover:text-foreground transition-colors hover:scale-110 duration-200">
                          <Icon />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">{name}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </TooltipProvider>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}
