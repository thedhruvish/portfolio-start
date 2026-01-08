import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import Turnstile from 'react-turnstile'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Field as ShadcnField,
  FieldError as ShadcnFieldError,
  FieldLabel as ShadcnFieldLabel,
} from '@/components/ui/field'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
// import { useContactDataSave } from '@/apiHooks/contactApi'

const contactFormSchema = z.object({
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

// --- 3. The Contact Form Component ---
export function ContactPage() {
  //   const { mutateAsync: contactDataSave } = useContactDataSave()

  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      message: '',
      cfTurnstileResponse: '',
    },
    validators: {
      onSubmit: contactFormSchema,
    },
    onSubmit: ({ value, formApi }) => {
      try {
        console.log(value)
        // await contactDataSave(value)
        toast.success('Message Sent!')
        formApi.reset()
      } catch (error) {
        toast.error('Error Sending Message')
        console.error(error)
      }
    },
  })

  return (
    <Card>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-8"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <form.Field
              name="firstName"
              children={(field) => (
                <ShadcnField className="gap-2">
                  <ShadcnFieldLabel htmlFor={field.name}>
                    First Name
                  </ShadcnFieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="John"
                  />
                  <ShadcnFieldError errors={field.state.meta.errors} />
                </ShadcnField>
              )}
            />
            <form.Field
              name="lastName"
              children={(field) => (
                <ShadcnField className="gap-2">
                  <ShadcnFieldLabel htmlFor={field.name}>
                    Last Name
                  </ShadcnFieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Doe"
                  />
                  <ShadcnFieldError errors={field.state.meta.errors} />
                </ShadcnField>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <form.Field
              name="email"
              children={(field) => (
                <ShadcnField className="gap-2">
                  <ShadcnFieldLabel htmlFor={field.name}>
                    Email
                  </ShadcnFieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="john.doe@example.com"
                  />
                  <ShadcnFieldError errors={field.state.meta.errors} />
                </ShadcnField>
              )}
            />
            <form.Field
              name="phoneNumber"
              children={(field) => (
                <ShadcnField className="gap-2">
                  <ShadcnFieldLabel htmlFor={field.name}>
                    Phone Number
                  </ShadcnFieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                  <ShadcnFieldError errors={field.state.meta.errors} />
                </ShadcnField>
              )}
            />
          </div>

          {/* Message */}
          <form.Field
            name="message"
            children={(field) => (
              <ShadcnField className="gap-2">
                <ShadcnFieldLabel htmlFor={field.name}>
                  Message
                </ShadcnFieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Tell us a little bit about your project..."
                  className="min-h-[120px]"
                />
                <p className="text-sm text-muted-foreground">
                  You have {500 - (field.state.value.length || 0)} characters
                  remaining.
                </p>
                <ShadcnFieldError errors={field.state.meta.errors} />
              </ShadcnField>
            )}
          />

          {/* Cloudflare Challenge */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <form.Field
              name="cfTurnstileResponse"
              children={(field) => (
                <ShadcnField className="gap-2">
                  <ShadcnFieldLabel>Security Verification</ShadcnFieldLabel>
                  <Turnstile
                    sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
                    onVerify={(token) => {
                      field.handleChange(token)
                    }}
                    onError={() => {
                      // We can manually set an error here if needed, or rely on validation when empty
                      // But Zod will catch empty string if token is missing
                    }}
                  />
                  <ShadcnFieldError errors={field.state.meta.errors} />
                </ShadcnField>
              )}
            />
          </div>

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button type="submit" disabled={!canSubmit}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            )}
          />
        </form>
      </CardContent>
    </Card>
  )
}
