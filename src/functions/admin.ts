import { createServerFn } from '@tanstack/react-start'
import { and, asc, desc, eq, like, ne, sql } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/db'
import { blogs, experiences, profile, projects, tags } from '@/db/schema'

export const ExperienceSchema = z.object({
  id: z.number().optional(),
  company: z.string().min(1),
  position: z.string().min(1),
  description: z.string().min(1),
  duration: z.string().optional(),
  order: z.number(),
})

export const getExperiencesFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    return await db.select().from(experiences).orderBy(asc(experiences.order))
  },
)

export const createExperienceFn = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) =>
    ExperienceSchema.omit({ id: true }).parse(data),
  )
  .handler(async ({ data }) => {
    await db.insert(experiences).values(data)
    return { success: true }
  })

export const updateExperienceFn = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => ExperienceSchema.parse(data))
  .handler(async ({ data }) => {
    if (!data.id) throw new Error('ID required for update')
    await db.update(experiences).set(data).where(eq(experiences.id, data.id))
    return { success: true }
  })

export const deleteExperienceFn = createServerFn({ method: 'POST' })
  .inputValidator((data: number) => z.number().parse(data))
  .handler(async ({ data: id }) => {
    await db.delete(experiences).where(eq(experiences.id, id))
    return { success: true }
  })

const ProfileSchema = z.object({
  name: z.string().min(1),
  headline: z.string().optional(),
  description: z.string().min(1),
  keywords: z.string().optional(),
  image: z.string().optional(),
  resumeLink: z.string().optional(),
  twitter: z.string().optional(),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  email: z.email().optional().or(z.literal('')),
})

export const getProfileFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const result = await db.select().from(profile).limit(1)
    return result[0] || null
  },
)

export const updateProfileFn = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => ProfileSchema.parse(data))
  .handler(async ({ data }) => {
    // Check if profile exists
    const existing = await db.select().from(profile).limit(1)

    if (existing.length > 0) {
      // Update
      await db.update(profile).set(data).where(eq(profile.id, existing[0].id))
    } else {
      // Insert
      await db.insert(profile).values(data)
    }
    return { success: true }
  })

// --- Projects ---

export const ProjectSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  details: z.string().optional(),
  image: z.string().optional(),
  github: z.string().optional(),
  link: z.string().optional(),
  tech: z.array(z.string()).optional(),
  isPublished: z.boolean().default(false),
  order: z.number(),
})

export const getProjectsFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    return await db.select().from(projects).orderBy(asc(projects.order))
  },
)

export const getProjectByIdFn = createServerFn({ method: 'GET' })
  .inputValidator((data: number) => z.number().parse(data))
  .handler(async ({ data: id }) => {
    const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1)
    return result[0] || null
  })

export const createProjectFn = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) =>
    ProjectSchema.omit({ id: true }).parse(data),
  )
  .handler(async ({ data }) => {
    // Check for slug uniqueness
    const existing = await db.query.projects.findFirst({
      where: eq(projects.slug, data.slug),
    })

    if (existing) {
      throw new Error(`Slug "${data.slug}" is already in use`)
    }

    await db.insert(projects).values(data)
    return { success: true }
  })

export const updateProjectFn = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => ProjectSchema.parse(data))
  .handler(async ({ data }) => {
    if (!data.id) throw new Error('ID required for update')

    // Check for slug uniqueness (excluding current project)
    const existing = await db.query.projects.findFirst({
      where: and(eq(projects.slug, data.slug), ne(projects.id, data.id)),
    })

    if (existing) {
      throw new Error(`Slug "${data.slug}" is already in use`)
    }

    await db.update(projects).set(data).where(eq(projects.id, data.id))
    return { success: true }
  })

export const deleteProjectFn = createServerFn({ method: 'POST' })
  .inputValidator((data: number) => z.number().parse(data))
  .handler(async ({ data: id }) => {
    await db.delete(projects).where(eq(projects.id, id))
    return { success: true }
  })

const BlogSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  thumbImage: z.string().optional(),
  content: z.any().optional(), // Using any for Yoopta JSON
  published: z.boolean().default(false),
  order: z.number().default(0),
  tags: z.array(z.string()).default([]),
})

export const getBlogsFn = createServerFn({ method: 'GET' })
  .inputValidator((data: unknown) =>
    z
      .object({
        page: z.number().default(1),
        pageSize: z.number().default(10),
        search: z.string().optional(),
      })
      .parse(data),
  )
  .handler(async ({ data: { page, pageSize, search } }) => {
    const offset = (page - 1) * pageSize

    let whereClause = undefined
    if (search) {
      whereClause = like(blogs.title, `%${search}%`)
    }

    const result = await db
      .select({
        id: blogs.id,
        title: blogs.title,
        slug: blogs.slug,
        published: blogs.published,
        createdAt: blogs.createdAt,
        updatedAt: blogs.updatedAt,
      })
      .from(blogs)
      .where(whereClause)
      .orderBy(desc(blogs.createdAt))
      .limit(pageSize)
      .offset(offset)

    // Get total count
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(blogs)
      .where(whereClause)

    return {
      data: result,
      total: Number(count),
      page,
      pageSize,
      totalPages: Math.ceil(Number(count) / pageSize),
    }
  })

export const getBlogFn = createServerFn({ method: 'GET' })
  .inputValidator((data: number) => z.number().parse(data))
  .handler(async ({ data: id }) => {
    const blog = await db.query.blogs.findFirst({
      where: eq(blogs.id, id),
    })

    if (!blog) return null

    const blogTags = await db
      .select({ tag: tags.tag })
      .from(tags)
      .where(eq(tags.blogId, id))

    return {
      ...blog,
      content: blog.content as any, // Cast jsonb unknown to any
      tags: blogTags.map((t) => t.tag),
    }
  })

export const createBlogFn = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => BlogSchema.omit({ id: true }).parse(data))
  .handler(async ({ data }) => {
    const { tags: tagList, ...blogData } = data

    // Check for slug uniqueness
    const existing = await db.query.blogs.findFirst({
      where: eq(blogs.slug, data.slug),
    })

    if (existing) {
      throw new Error(`Slug "${data.slug}" is already in use`)
    }

    const [newBlog] = await db
      .insert(blogs)
      .values(blogData)
      .returning({ id: blogs.id })

    if (tagList.length > 0) {
      await db.insert(tags).values(
        tagList.map((tag) => ({
          tag,
          blogId: newBlog.id,
        })),
      )
    }

    return { success: true }
  })

export const updateBlogFn = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => BlogSchema.parse(data))
  .handler(async ({ data }) => {
    const { id, tags: tagList, ...blogData } = data
    if (!id) throw new Error('ID required for update')

    // Check for slug uniqueness (excluding current blog)
    const existing = await db.query.blogs.findFirst({
      where: and(eq(blogs.slug, data.slug), ne(blogs.id, id)),
    })

    if (existing) {
      throw new Error(`Slug "${data.slug}" is already in use`)
    }

    // Update blog
    await db
      .update(blogs)
      .set({ ...blogData, updatedAt: new Date() })
      .where(eq(blogs.id, id))

    // Update tags: delete all and re-insert
    await db.delete(tags).where(eq(tags.blogId, id))

    if (tagList.length > 0) {
      await db.insert(tags).values(
        tagList.map((tag) => ({
          tag,
          blogId: id,
        })),
      )
    }

    return { success: true }
  })

export const deleteBlogFn = createServerFn({ method: 'POST' })
  .inputValidator((data: number) => z.number().parse(data))
  .handler(async ({ data: id }) => {
    await db.delete(blogs).where(eq(blogs.id, id))
    return { success: true }
  })

export const updateBlogStatusFn = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) =>
    z
      .object({
        id: z.number(),
        published: z.boolean(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    await db
      .update(blogs)
      .set({ published: data.published, updatedAt: new Date() })
      .where(eq(blogs.id, data.id))
    return { success: true }
  })
