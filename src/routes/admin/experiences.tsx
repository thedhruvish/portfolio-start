import { useState } from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import type { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Field as ShadcnField,
  FieldError as ShadcnFieldError,
  FieldLabel as ShadcnFieldLabel,
} from '@/components/ui/field'
import {
  ExperienceSchema,
  createExperienceFn,
  deleteExperienceFn,
  getExperiencesFn,
  updateExperienceFn,
} from '@/functions/admin'

export const Route = createFileRoute('/admin/experiences')({
  loader: async () => {
    const experiences = await getExperiencesFn()
    return { experiences }
  },
  component: AdminExperiences,
})

type ExperienceFormValues = z.infer<typeof ExperienceSchema>

function AdminExperiences() {
  const { experiences } = Route.useLoaderData()
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingExperience, setEditingExperience] =
    useState<ExperienceFormValues | null>(null)

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this experience?')) return
    try {
      await deleteExperienceFn({ data: id })
      toast.success('Experience deleted')
      router.invalidate()
    } catch (error) {
      toast.error('Failed to delete experience')
    }
  }

  const handleEdit = (experience: any) => {
    setEditingExperience(experience)
    setIsDialogOpen(true)
  }

  const handleCreate = () => {
    setEditingExperience(null)
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Experiences</h2>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add Experience
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {experiences.map((exp) => (
          <Card key={exp.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="line-clamp-1">{exp.company}</CardTitle>
              <CardDescription className="font-semibold text-foreground">
                {exp.position}
              </CardDescription>
              <div className="text-sm text-muted-foreground">
                {exp.duration}
              </div>
            </CardHeader>
            <CardContent className="mt-auto pt-0">
              <p className="text-sm line-clamp-3 mb-4">{exp.description}</p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(exp)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(exp.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) setEditingExperience(null)
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingExperience ? 'Edit Experience' : 'Add Experience'}
            </DialogTitle>
          </DialogHeader>
          <ExperienceForm
            initialValues={
              editingExperience || {
                company: '',
                position: '',
                description: '',
                duration: '',
                order: 0,
              }
            }
            onSubmit={() => {
              setIsDialogOpen(false)
              router.invalidate()
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ExperienceForm({
  initialValues,
  onSubmit,
}: {
  initialValues: ExperienceFormValues
  onSubmit: () => void
}) {
  const form = useForm({
    defaultValues: initialValues,
    validators: {
      onSubmit: ExperienceSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        if (value.id) {
          await updateExperienceFn({ data: value })
          toast.success('Experience updated')
        } else {
          await createExperienceFn({ data: value })
          toast.success('Experience created')
        }
        await onSubmit()
      } catch (error) {
        toast.error('Failed to save experience')
        console.error(error)
      }
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-4"
    >
      <form.Field
        name="company"
        children={(field) => (
          <ShadcnField className="gap-2">
            <ShadcnFieldLabel>Company Name</ShadcnFieldLabel>
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
        name="position"
        children={(field) => (
          <ShadcnField className="gap-2">
            <ShadcnFieldLabel>Position</ShadcnFieldLabel>
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

      <div className="grid grid-cols-2 gap-4">
        <form.Field
          name="duration"
          children={(field) => (
            <ShadcnField className="gap-2">
              <ShadcnFieldLabel>
                Duration (e.g. Jan 2020 - Present)
              </ShadcnFieldLabel>
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
          name="order"
          children={(field) => (
            <ShadcnField className="gap-2">
              <ShadcnFieldLabel>Display Order</ShadcnFieldLabel>
              <Input
                type="number"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(Number(e.target.value))}
              />
              <ShadcnFieldError errors={field.state.meta.errors} />
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
            />
            <ShadcnFieldError errors={field.state.meta.errors} />
          </ShadcnField>
        )}
      />

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <Button type="submit" disabled={!canSubmit} className="w-full">
            {isSubmitting ? 'Saving...' : 'Save Experience'}
          </Button>
        )}
      />
    </form>
  )
}
