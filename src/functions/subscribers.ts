import { createServerFn } from '@tanstack/react-start'
import { desc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/db'
import { subscribers } from '@/db/schema/subscribers'

const subscriberSchema = z.object({
  email: z.email(),
})

export const subscribeToNewsletterFn = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => subscriberSchema.parse(data))
  .handler(async ({ data: { email } }) => {
    // Check if already subscribed
    const existing = await db
      .select()
      .from(subscribers)
      .where(eq(subscribers.email, email))
      .limit(1)

    if (existing.length > 0) {
      return { success: true, message: 'Already subscribed!' }
    }

    await db.insert(subscribers).values({ email })
    return { success: true, message: 'Successfully subscribed!' }
  })

export const getSubscribersFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    return await db
      .select()
      .from(subscribers)
      .orderBy(desc(subscribers.createdAt))
  },
)

export const deleteSubscriberFn = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => z.number().parse(data))
  .handler(async ({ data: id }) => {
    await db.delete(subscribers).where(eq(subscribers.id, id))
    return { success: true, message: 'Subscriber deleted' }
  })

export const toggleSubscriberStatusFn = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) =>
    z.object({ id: z.number(), active: z.boolean() }).parse(data),
  )
  .handler(async ({ data: { id, active } }) => {
    await db.update(subscribers).set({ active }).where(eq(subscribers.id, id))
    return { success: true, message: 'Subscriber status updated' }
  })
