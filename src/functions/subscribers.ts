import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
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
