import { createServerFn } from '@tanstack/react-start'
import z from 'zod'

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
    return { success: true }
  })
