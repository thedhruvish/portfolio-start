import { index, integer, pgTable, serial, text } from 'drizzle-orm/pg-core'

export const experiences = pgTable(
  'experiences',
  {
    id: serial('id').primaryKey(),
    company: text('company').notNull(),
    position: text('position').notNull(),
    description: text('description').notNull(),
    duration: text('duration'), // e.g., "Jan 2020 - Present"
    order: integer('order').default(0),
  },
  (table) => ({
    orderIdx: index('experiences_order_idx').on(table.order),
  }),
)

export type Experience = typeof experiences.$inferSelect
export type NewExperience = typeof experiences.$inferInsert
