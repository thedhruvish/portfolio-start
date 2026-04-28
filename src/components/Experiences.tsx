import { motion } from 'framer-motion'
import { useState } from 'react'
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react'
import type { Experience } from '@/db/schema/experiences'
import { cn } from '@/lib/utils'

const ExperienceItem = ({ exp, index, isLast }: { exp: Experience; index: number; isLast: boolean }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const isLongDescription = exp.description.length > 250

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="relative flex items-start group"
    >
      {/* Dot */}
      <div className="absolute left-5 -translate-x-1/2 flex items-center justify-center w-8 h-8 rounded-full border border-border bg-background shadow shrink-0 z-10 mt-1">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
      </div>

      {/* Content */}
      <div className={cn("flex-1 ml-12", !isLast && "pb-10")}>
        <div className="flex flex-col gap-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-xl font-bold">{exp.company}</h3>
            <span className="text-xs font-medium text-muted-foreground whitespace-nowrap bg-muted px-3 py-1 rounded-full w-fit">
              {exp.duration}
            </span>
          </div>
          <div className="text-sm font-semibold text-primary">
            {exp.position}
          </div>
          
          <div className="relative mt-2">
            <motion.div
              initial={false}
              animate={{ height: isExpanded ? 'auto' : isLongDescription ? 80 : 'auto' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="relative overflow-hidden"
            >
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {exp.description}
              </p>
              {!isExpanded && isLongDescription && (
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent pointer-events-none" />
              )}
            </motion.div>
            
            {isLongDescription && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 flex items-center gap-1 text-xs font-medium text-primary hover:underline transition-colors"
              >
                {isExpanded ? (
                  <>
                    Show less <IconChevronUp size={14} />
                  </>
                ) : (
                  <>
                    Read more <IconChevronDown size={14} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export const Experiences = ({
  experiences,
}: {
  experiences: Array<Experience>
}) => {
  if (experiences.length === 0) return null

  return (
    <div className="relative space-y-0 before:absolute before:top-5 before:bottom-0 before:left-5 before:-translate-x-px before:w-0.5 before:bg-gradient-to-b before:from-border before:via-border before:to-transparent">
      {experiences.map((exp, index) => (
        <ExperienceItem 
          key={exp.id} 
          exp={exp} 
          index={index} 
          isLast={index === experiences.length - 1} 
        />
      ))}
    </div>
  )
}
