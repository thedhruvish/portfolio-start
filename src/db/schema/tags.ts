import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core'
import { blogs } from './blogs'

export const tags = pgTable('tags', {
  id: serial('id').primaryKey(),
  tag: text('tag').notNull(),
  blogId: integer('blog_id')
    .references(() => blogs.id, { onDelete: 'cascade' })
    .notNull(),
})
