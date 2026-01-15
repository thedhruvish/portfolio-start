import { pgTable, serial, text } from 'drizzle-orm/pg-core'

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  image: text('image'),
  github: text('github'),
  link: text('link'),
  tech: text('tech').array(),
})
