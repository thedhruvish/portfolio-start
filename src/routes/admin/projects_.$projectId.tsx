import { createFileRoute, useRouter, Link } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import {
  Check,
  ChevronsUpDown,
  X,
  ArrowLeft,
  Save,
  Globe,
  Lock,
  ExternalLink,
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Field as ShadcnField,
  FieldError as ShadcnFieldError,
  FieldLabel as ShadcnFieldLabel,
} from '@/components/ui/field'
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
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  ProjectSchema,
  createProjectFn,
  updateProjectFn,
  getProjectByIdFn,
} from '@/functions/admin'
import { MarkdownEditor } from '@/components/MarkdownEditor'
import { Switch } from '@/components/ui/switch'

export const Route = createFileRoute('/admin/projects_/$projectId')({
  loader: async ({ params }) => {
    const { projectId } = params
    if (projectId === 'new') {
      return { project: null }
    }
    const project = await getProjectByIdFn({ data: parseInt(projectId) })
    return { project }
  },
  component: ProjectEditor,
})

function ProjectEditor() {
  const { project } = Route.useLoaderData()
  const router = useRouter()

  const form = useForm({
    defaultValues: project || {
      title: '',
      slug: '',
      description: '',
      details: '',
      image: '',
      github: '',
      link: '',
      tech: [],
      isPublished: false,
      order: 0,
    },
    validators: {
      onSubmit: ProjectSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        if (project?.id) {
          await updateProjectFn({ data: { ...value, id: project.id } })
          toast.success('Project updated')
        } else {
          await createProjectFn({ data: value })
          toast.success('Project created')
        }
        router.navigate({ to: '/admin/projects' })
      } catch (error: any) {
        toast.error(error.message || 'Failed to save project')
      }
    },
  })

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link to="/admin/projects">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">
            {project ? 'Edit Project' : 'New Project'}
          </h2>
          {project && (
            <Button variant="outline" size="sm" asChild className="gap-2">
              <Link
                to="/projects/$slug"
                params={{ slug: project.slug }}
                target="_blank"
              >
                <ExternalLink className="size-4" />
                Preview Page
              </Link>
            </Button>
          )}
        </div>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              onClick={() => form.handleSubmit()}
              disabled={!canSubmit || isSubmitting}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? 'Saving...' : 'Save Project'}
            </Button>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <CardSection title="Basic Information">
            <div className="space-y-4 p-4">
              <form.Field
                name="title"
                children={(field) => (
                  <ShadcnField className="gap-2">
                    <ShadcnFieldLabel>Title</ShadcnFieldLabel>
                    <Input
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        field.handleChange(e.target.value)
                        // Auto-generate slug if it's a new project or slug is empty
                        if (!project && !form.getFieldValue('slug')) {
                          form.setFieldValue(
                            'slug',
                            generateSlug(e.target.value),
                          )
                        }
                      }}
                    />
                    <ShadcnFieldError errors={field.state.meta.errors} />
                  </ShadcnField>
                )}
              />

              <form.Field
                name="slug"
                children={(field) => (
                  <ShadcnField className="gap-2">
                    <ShadcnFieldLabel>Slug</ShadcnFieldLabel>
                    <div className="flex gap-2">
                      <Input
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() =>
                          field.handleChange(
                            generateSlug(form.getFieldValue('title')),
                          )
                        }
                      >
                        Regenerate
                      </Button>
                    </div>
                    <ShadcnFieldError errors={field.state.meta.errors} />
                  </ShadcnField>
                )}
              />

              <form.Field
                name="description"
                children={(field) => (
                  <ShadcnField className="gap-2">
                    <ShadcnFieldLabel>Short Description</ShadcnFieldLabel>
                    <Textarea
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <ShadcnFieldError errors={field.state.meta.errors} />
                  </ShadcnField>
                )}
              />
            </div>
          </CardSection>

          <CardSection title="Detailed Content (Markdown)">
            <div className="p-4">
              <form.Field
                name="details"
                children={(field) => (
                  <MarkdownEditor
                    value={field.state.value || ''}
                    onChange={(val) => field.handleChange(val)}
                    placeholder="Write your project details here..."
                  />
                )}
              />
            </div>
          </CardSection>
        </div>

        <div className="space-y-6">
          <CardSection title="Status & Settings">
            <div className="p-4 space-y-6">
              <form.Field
                name="isPublished"
                children={(field) => (
                  <div className="flex items-center justify-between gap-2 border rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      {field.state.value ? (
                        <Globe className="size-4 text-primary" />
                      ) : (
                        <Lock className="size-4 text-muted-foreground" />
                      )}
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">Published</span>
                        <span className="text-xs text-muted-foreground">
                          Visible on portfolio
                        </span>
                      </div>
                    </div>
                    <Switch
                      checked={field.state.value}
                      onCheckedChange={field.handleChange}
                    />
                  </div>
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
                      onChange={(e) =>
                        field.handleChange(Number(e.target.value))
                      }
                    />
                  </ShadcnField>
                )}
              />
            </div>
          </CardSection>

          <CardSection title="Media & Links">
            <div className="p-4 space-y-4">
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
          </CardSection>

          <CardSection title="Technologies">
            <div className="p-4">
              <form.Field
                name="tech"
                children={(field) => (
                  <TechStackSelector
                    value={field.state.value}
                    onChange={(val) => field.handleChange(val)}
                  />
                )}
              />
            </div>
          </CardSection>
        </div>
      </div>
    </div>
  )
}

function CardSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b bg-muted/30">
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  )
}

// Reusing TechStackSelector from existing projects.tsx
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
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
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
            Select tech...
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <Command>
            <CommandInput placeholder="Search tech..." />
            <CommandList>
              <CommandEmpty>No tech found.</CommandEmpty>
              <CommandGroup className="max-h-64 overflow-auto">
                {availableTech.map((techName) => {
                  const isSelected = value?.includes(techName)
                  return (
                    <CommandItem
                      key={techName}
                      value={techName}
                      onSelect={() => {
                        if (isSelected) {
                          onChange(value.filter((t) => t !== techName))
                        } else {
                          onChange([...(value || []), techName])
                        }
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
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
    </div>
  )
}
