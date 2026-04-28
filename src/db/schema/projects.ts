import { boolean, index, integer, pgTable, serial, text } from 'drizzle-orm/pg-core'

export const projects = pgTable(
  'projects',
  {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    slug: text('slug').notNull().unique(),
    description: text('description').notNull(),
    details: text('details'),
    details_url: text('details_url'),
    image: text('image'),
    github: text('github'),
    link: text('link'),
    tech: text('tech').array(),
    isPublished: boolean('is_published').default(false).notNull(),
    order: integer('order').default(0),
  },
  (table) => ({
    orderIdx: index('projects_order_idx').on(table.order),
    slugIdx: index('projects_slug_idx').on(table.slug),
  }),
)

export type Project = typeof projects.$inferSelect
