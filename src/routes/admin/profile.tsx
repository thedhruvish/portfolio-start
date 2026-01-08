import { createFileRoute } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Field as ShadcnField,
  FieldError as ShadcnFieldError,
  FieldLabel as ShadcnFieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getProfileFn, updateProfileFn } from '@/functions/admin'

export const Route = createFileRoute('/admin/profile')({
  loader: async () => {
    const profile = await getProfileFn()
    return { profile }
  },
  component: AdminProfile,
})

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  headline: z.string(),
  description: z.string().min(1, 'Description is required'),
  image: z.string(),
  resumeLink: z.string(),
  twitter: z.string(),
  github: z.string(),
  linkedin: z.string(),
  email: z.email(),
})

function AdminProfile() {
  const { profile } = Route.useLoaderData()

  const form = useForm({
    defaultValues: {
      name: profile.name || '',
      headline: profile.headline || '',
      description: profile.description || '',
      image: profile.image || '',
      resumeLink: profile.resumeLink || '',
      twitter: profile.twitter || '',
      github: profile.github || '',
      linkedin: profile.linkedin || '',
      email: profile.email || '',
    },
    validators: {
      onSubmit: profileSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await updateProfileFn({ data: value })
        toast.success('Profile updated successfully')
      } catch (error: any) {
        toast.error('Failed to update profile')
        console.error(error?.message)
      }
    },
  })

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <form.Field
                name="name"
                children={(field) => (
                  <ShadcnField className="gap-2">
                    <ShadcnFieldLabel>Name</ShadcnFieldLabel>
                    <Input
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <ShadcnFieldError errors={field.state.meta.errors} />
                  </ShadcnField>
                )}
              />
              <form.Field
                name="headline"
                children={(field) => (
                  <ShadcnField className="gap-2">
                    <ShadcnFieldLabel>Headline</ShadcnFieldLabel>
                    <Input
                      name={field.name}
                      value={field.state.value || ''}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Software Engineer"
                    />
                  </ShadcnField>
                )}
              />
            </div>

            <form.Field
              name="description"
              children={(field) => (
                <ShadcnField className="gap-2">
                  <ShadcnFieldLabel>Description</ShadcnFieldLabel>
                  <Textarea
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="h-24"
                  />
                  <ShadcnFieldError errors={field.state.meta.errors} />
                </ShadcnField>
              )}
            />

            <form.Field
              name="image"
              children={(field) => (
                <ShadcnField className="gap-2">
                  <ShadcnFieldLabel>Profile Image URL</ShadcnFieldLabel>
                  <Input
                    name={field.name}
                    value={field.state.value || ''}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="https://..."
                  />
                </ShadcnField>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <form.Field
                name="email"
                children={(field) => (
                  <ShadcnField className="gap-2">
                    <ShadcnFieldLabel>Email</ShadcnFieldLabel>
                    <Input
                      name={field.name}
                      value={field.state.value || ''}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <ShadcnFieldError errors={field.state.meta.errors} />
                  </ShadcnField>
                )}
              />
              <form.Field
                name="resumeLink"
                children={(field) => (
                  <ShadcnField className="gap-2">
                    <ShadcnFieldLabel>Resume Link</ShadcnFieldLabel>
                    <Input
                      name={field.name}
                      value={field.state.value || ''}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </ShadcnField>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <form.Field
                name="github"
                children={(field) => (
                  <ShadcnField className="gap-2">
                    <ShadcnFieldLabel>GitHub URL</ShadcnFieldLabel>
                    <Input
                      name={field.name}
                      value={field.state.value || ''}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </ShadcnField>
                )}
              />
              <form.Field
                name="twitter"
                children={(field) => (
                  <ShadcnField className="gap-2">
                    <ShadcnFieldLabel>Twitter URL</ShadcnFieldLabel>
                    <Input
                      name={field.name}
                      value={field.state.value || ''}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </ShadcnField>
                )}
              />
              <form.Field
                name="linkedin"
                children={(field) => (
                  <ShadcnField className="gap-2">
                    <ShadcnFieldLabel>LinkedIn URL</ShadcnFieldLabel>
                    <Input
                      name={field.name}
                      value={field.state.value || ''}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </ShadcnField>
                )}
              />
            </div>

            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit}>
                  {isSubmitting ? 'Saving...' : 'Save Profile'}
                </Button>
              )}
            />
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
