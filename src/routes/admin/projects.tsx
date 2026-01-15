import { useState } from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { Check, ChevronsUpDown, Pencil, Plus, Trash2, X } from 'lucide-react'
import type { z } from 'zod'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
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
  ProjectSchema,
  createProjectFn,
  deleteProjectFn,
  getProjectsFn,
  updateProjectFn,
} from '@/functions/admin'

export const Route = createFileRoute('/admin/projects')({
  loader: async () => {
    const projects = await getProjectsFn()
    return { projects }
  },
  component: AdminProjects,
})

type ProjectFormValues = z.infer<typeof ProjectSchema>

function AdminProjects() {
  const { projects } = Route.useLoaderData()
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProject, setEditingProject] =
    useState<ProjectFormValues | null>(null)

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return
    try {
      await deleteProjectFn({ data: id })
      toast.success('Project deleted')
      router.invalidate()
    } catch (error) {
      toast.error('Failed to delete project')
    }
  }

  const handleEdit = (project: any) => {
    setEditingProject(project)
    setIsDialogOpen(true)
  }

  const handleCreate = () => {
    setEditingProject(null)
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="flex flex-col">
            {project.image && (
              <div className="aspect-video w-full overflow-hidden rounded-t-xl border-b">
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <CardHeader>
              <CardTitle className="line-clamp-1">{project.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {project.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto pt-0 flex justify-end gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleEdit(project)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDelete(project.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) setEditingProject(null)
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? 'Edit Project' : 'Add Project'}
            </DialogTitle>
          </DialogHeader>
          <ProjectForm
            initialValues={
              editingProject || {
                title: '',
                description: '',
                image: '',
                github: '',
                link: '',
                tech: [],
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

function ProjectForm({
  initialValues,
  onSubmit,
}: {
  initialValues: ProjectFormValues
  onSubmit: () => void
}) {
  const form = useForm({
    defaultValues: initialValues,
    validators: {
      onSubmit: ProjectSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        if (value.id) {
          await updateProjectFn({ data: value })
          toast.success('Project updated')
        } else {
          await createProjectFn({ data: value })
          toast.success('Project created')
        }
        await onSubmit()
      } catch (error) {
        toast.error('Failed to save project')
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
        name="title"
        children={(field) => (
          <ShadcnField className="gap-2">
            <ShadcnFieldLabel>Title</ShadcnFieldLabel>
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

      <form.Field
        name="image"
        children={(field) => (
          <ShadcnField className="gap-2">
            <ShadcnFieldLabel>Image URL</ShadcnFieldLabel>
            <Input
              name={field.name}
              value={field.state.value || ''}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </ShadcnField>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
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
          name="link"
          children={(field) => (
            <ShadcnField className="gap-2">
              <ShadcnFieldLabel>Live Link</ShadcnFieldLabel>
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

      <form.Field
        name="tech"
        children={(field) => (
          <TechStackSelector
            value={field.state.value}
            onChange={(val) => field.handleChange(val)}
          />
        )}
      />

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <Button type="submit" disabled={!canSubmit} className="w-full">
            {isSubmitting ? 'Saving...' : 'Save Project'}
          </Button>
        )}
      />
    </form>
  )
}

function TechStackSelector({
  value = [],
  onChange,
}: {
  value?: Array<string> | null
  onChange: (val: Array<string>) => void
}) {
  const [open, setOpen] = useState(false)
  const availableTech = [
    'AWS',
    'Appwrite',
    'BootStrap',
    'Bun',
    'CSS',
    'ExpoApp',
    'ExpressJs',
    'Figma',
    'Github',
    'Html',
    'JavaScript',
    'MDXIcon',
    'MongoDB',
    'Motion',
    'NestJs',
    'Netlify',
    'NextJs',
    'NodeJs',
    'PostgreSQL',
    'Postman',
    'Prisma',
    'ReactIcon',
    'Sanity',
    'Shadcn',
    'SocketIo',
    'TailwindCss',
    'ThreeJs',
    'TypeScript',
    'Vercel',
  ]

  return (
    <ShadcnField className="gap-2">
      <ShadcnFieldLabel>Tech Stack</ShadcnFieldLabel>
      <div className="flex flex-wrap gap-2 mb-2">
        {value?.map((tech) => (
          <Badge key={tech} variant="secondary" className="gap-1">
            {tech}
            <button
              type="button"
              onClick={() => {
                onChange(value.filter((t) => t !== tech))
              }}
              className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
            </button>
          </Badge>
        ))}
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            Select technologies...
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search tech..." />
            <CommandList>
              <CommandEmpty>No tech found.</CommandEmpty>
              <CommandGroup>
                {availableTech.map((techName) => {
                  const isSelected = value?.includes(techName)
                  if (isSelected) return null
                  return (
                    <CommandItem
                      key={techName}
                      value={techName}
                      onSelect={() => {
                        onChange([...(value || []), techName])
                        setOpen(false)
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                          isSelected ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                      {techName}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </ShadcnField>
  )
}
