import { pgTable, serial, text } from 'drizzle-orm/pg-core'

export const experiences = pgTable('experiences', {
  id: serial('id').primaryKey(),
  company: text('company').notNull(),
  position: text('position').notNull(),
  description: text('description').notNull(),
  duration: text('duration'), // e.g., "Jan 2020 - Present"
})

export type Experience = typeof experiences.$inferSelect
export type NewExperience = typeof experiences.$inferInsert
