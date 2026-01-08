import { pgTable, serial, text } from 'drizzle-orm/pg-core'

export const profile = pgTable('profile', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  headline: text('headline'),
  description: text('description').notNull(),
  image: text('image'),
  resumeLink: text('resume_link'),
  twitter: text('twitter'),
  github: text('github'),
  linkedin: text('linkedin'),
  email: text('email'),
})
