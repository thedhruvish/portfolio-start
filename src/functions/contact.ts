import { createServerFn } from '@tanstack/react-start'
import { desc, like, or } from 'drizzle-orm'
import z from 'zod'
import { isValidTurnstileToken } from './auth'
import { db } from '@/db'
import { contact } from '@/db/schema'

export const contactFormSchema = z.object({
  firstName: z.string().min(2, {
    message: 'First name must be at least 2 characters.',
  }),
  lastName: z.string().min(2, {
    message: 'Last name must be at least 2 characters.',
  }),
  email: z.email({
    message: 'Please enter a valid email address.',
  }),
  phoneNumber: z.string(),
  message: z
    .string()
    .min(10, {
      message: 'Message must be at least 10 characters.',
    })
    .max(500, {
      message: 'Message must not be longer than 500 characters.',
    }),
  // This field will be populated by the Cloudflare widget
  cfTurnstileResponse: z.string().min(1, {
    message: 'Please complete the security challenge.',
  }),
})

export const submitContactFormFn = createServerFn({ method: 'POST' })
  .inputValidator(contactFormSchema)
  .handler(async ({ data }) => {
    // 1. Validate Turnstile
    await isValidTurnstileToken(data.cfTurnstileResponse)

    // 2. Insert into DB
    await db.insert(contact).values({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      message: data.message,
    })

    return { success: true }
  })

export const getContactsFn = createServerFn({ method: 'GET' })
  .inputValidator((data: unknown) =>
    z
      .object({
        search: z.string().optional(),
      })
      .parse(data),
  )
  .handler(async ({ data: { search } }) => {
    let whereClause = undefined
    if (search) {
      const searchLower = `%${search.toLowerCase()}%`
      whereClause = or(
        like(contact.firstName, searchLower),
        like(contact.lastName, searchLower),
        like(contact.email, searchLower),
      )
    }

    return await db
      .select()
      .from(contact)
      .where(whereClause)
      .orderBy(desc(contact.id))
  })
