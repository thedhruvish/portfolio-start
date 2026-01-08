import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { checkAuthFn, loginFn } from '@/functions/auth'

export const Route = createFileRoute('/auth/')({
  beforeLoad: async () => {
    const auth = await checkAuthFn()
    if (auth) {
      throw redirect({ to: '/admin' })
    }
  },
  component: LoginComponent,
})

const loginSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  turnstileToken: z.string().min(1, 'Please complete the security challenge'),
})

function LoginComponent() {
  const router = useRouter()

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
      turnstileToken: '',
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await loginFn({ data: value })
        router.navigate({ to: '/admin' })
      } catch (error: any) {
        toast.error(error.message)
      }
    },
  })

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
            className="space-y-6"
          >
            {/* Email */}
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
                    type="email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="admin@example.com"
                  />
                  <ShadcnFieldError errors={field.state.meta.errors} />
                </ShadcnField>
              )}
            />

            {/* Password */}
            <form.Field
              name="password"
              children={(field) => (
                <ShadcnField className="gap-2">
                  <ShadcnFieldLabel htmlFor={field.name}>
                    Password
                  </ShadcnFieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="••••••••"
                  />
                  <ShadcnFieldError errors={field.state.meta.errors} />
                </ShadcnField>
              )}
            />

            {/* Turnstile */}
            <form.Field
              name="turnstileToken"
              children={(field) => (
                <ShadcnField className="gap-2">
                  <Turnstile
                    sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
                    onVerify={(token) => field.handleChange(token)}
                  />
                  <ShadcnFieldError errors={field.state.meta.errors} />
                </ShadcnField>
              )}
            />

            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button type="submit" className="w-full" disabled={!canSubmit}>
                  {isSubmitting ? 'Logging in...' : 'Login'}
                </Button>
              )}
            />
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
