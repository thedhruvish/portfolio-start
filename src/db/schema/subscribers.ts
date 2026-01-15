import { boolean, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const subscribers = pgTable('subscribers', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  active: boolean('active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
})
