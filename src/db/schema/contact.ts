import { pgTable, serial, text } from 'drizzle-orm/pg-core'

export const contact = pgTable('contact', {
  id: serial('id').primaryKey(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull(),
  phoneNumber: text('phone_number').notNull(),
  message: text('message').notNull(),
})
