import { motion } from 'framer-motion'
import type { Experience } from '@/db/schema/experiences'

export const Experiences = ({
  experiences,
}: {
  experiences: Array<Experience>
}) => {
  if (experiences.length === 0) return null

  return (
    <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
      {experiences.map((exp, index) => (
        <motion.div
          key={exp.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
          className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
        >
          {/* Dot */}
          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute left-0 md:left-1/2 -translate-x-1/2 md:translate-x-0">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          </div>

          {/* Content */}
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] py-4 ml-12 md:ml-0">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xl font-bold">{exp.company}</h3>
                <span className="text-xs font-medium text-muted-foreground whitespace-nowrap bg-muted px-2 py-1 rounded-full">
                  {exp.duration}
                </span>
              </div>
              <div className="text-sm font-semibold text-primary">
                {exp.position}
              </div>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {exp.description}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
