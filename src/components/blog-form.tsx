import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { useRouter } from '@tanstack/react-router'
import { Plus, X } from 'lucide-react'
import { useState } from 'react'
import { Switch } from './ui/switch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Field as ShadcnField,
  FieldError as ShadcnFieldError,
  FieldLabel as ShadcnFieldLabel,
} from '@/components/ui/field'
import { BlockEditor } from '@/components/block-editor'
import { createBlogFn, updateBlogFn } from '@/functions/admin'
import { Badge } from '@/components/ui/badge'

const BlogSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  thumbImage: z.string().optional(),
  content: z.any().optional(),
  published: z.boolean().default(false),
  order: z.number().default(0),
  tags: z.array(z.string()).default([]),
})

type BlogFormValues = z.infer<typeof BlogSchema>

export function BlogForm({
  initialValues,
}: {
  initialValues?: BlogFormValues
}) {
  const router = useRouter()
  const [tagInput, setTagInput] = useState('')

  const form = useForm({
    defaultValues: initialValues || {
      title: '',
      slug: '',
      description: '',
      thumbImage: '',
      content: null,
      published: false,
      order: 0,
      tags: [],
    },
    // Removed validator to avoid type mismatch without adapter
    onSubmit: async ({ value }) => {
      console.log(value)
      try {
        if (value.id) {
          await updateBlogFn({ data: value })
          toast.success('Blog updated')
        } else {
          await createBlogFn({ data: value })
          toast.success('Blog created')
        }
        router.navigate({ to: '/admin/blogs' })
      } catch (error) {
        toast.error('Failed to save blog')
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
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  // Auto-generate slug from title if slug is empty
                  if (!form.getFieldValue('slug')) {
                    form.setFieldValue(
                      'slug',
                      e.target.value
                        .toLowerCase()
                        .replace(/ /g, '-')
                        .replace(/[^\w-]+/g, ''),
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
      </div>

      <form.Field
        name="description"
        children={(field) => (
          <ShadcnField className="gap-2">
            <ShadcnFieldLabel>Description</ShadcnFieldLabel>
            <Textarea
              name={field.name}
              value={field.state.value || ''}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            <ShadcnFieldError errors={field.state.meta.errors} />
          </ShadcnField>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <form.Field
          name="thumbImage"
          children={(field) => (
            <ShadcnField className="gap-2">
              <ShadcnFieldLabel>Thumbnail Image URL</ShadcnFieldLabel>
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
          name="order"
          children={(field) => (
            <ShadcnField className="gap-2">
              <ShadcnFieldLabel>Order</ShadcnFieldLabel>
              <Input
                type="number"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(Number(e.target.value))}
              />
            </ShadcnField>
          )}
        />
      </div>

      <form.Field
        name="tags"
        children={(field) => (
          <ShadcnField className="gap-2">
            <ShadcnFieldLabel>Tags</ShadcnFieldLabel>
            <div className="flex flex-wrap gap-2 mb-2">
              {field.state.value.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => {
                      field.handleChange(
                        field.state.value.filter((t) => t !== tag),
                      )
                    }}
                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    if (tagInput.trim()) {
                      const newTags = [...field.state.value, tagInput.trim()]
                      // Remove duplicates
                      field.handleChange([...new Set(newTags)])
                      setTagInput('')
                    }
                  }
                }}
                placeholder="Add a tag..."
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (tagInput.trim()) {
                    const newTags = [...field.state.value, tagInput.trim()]
                    field.handleChange([...new Set(newTags)])
                    setTagInput('')
                  }
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </ShadcnField>
        )}
      />

      <form.Field
        name="published"
        children={(field) => (
          <div className="flex items-center gap-2">
            <Switch
              checked={field.state.value}
              onCheckedChange={field.handleChange}
            />
            <ShadcnFieldLabel className="pb-0">Published</ShadcnFieldLabel>
          </div>
        )}
      />

      <form.Field
        name="content"
        children={(field) => (
          <div className="space-y-2">
            <ShadcnFieldLabel>Content</ShadcnFieldLabel>
            <BlockEditor
              value={field.state.value}
              onChange={(val) => field.handleChange(val)}
            />
          </div>
        )}
      />

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.history.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!canSubmit}>
              {isSubmitting ? 'Saving...' : 'Save Blog'}
            </Button>
          </div>
        )}
      />
    </form>
  )
}
