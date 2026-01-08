import { createServerFn } from '@tanstack/react-start'
import { desc, eq, like, sql } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/db'
import { blogs, profile, projects, tags } from '@/db/schema'

const ProfileSchema = z.object({
  name: z.string().min(1),
  headline: z.string().optional(),
  description: z.string().min(1),
  image: z.string().optional(),
  resumeLink: z.string().optional(),
  twitter: z.string().optional(),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
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

const ProjectSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1),
  description: z.string().min(1),
  image: z.string().optional(),
  github: z.string().optional(),
  link: z.string().optional(),
  tech: z
    .array(
      z.object({
        name: z.string(),
        icon: z.string(), // Storing icon name for simplicity in DB, will need mapping
      }),
    )
    .optional(),
})

export const getProjectsFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    return await db.select().from(projects).orderBy(projects.id)
  },
)

export const createProjectFn = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) =>
    ProjectSchema.omit({ id: true }).parse(data),
  )
  .handler(async ({ data }) => {
    await db.insert(projects).values(data)
    return { success: true }
  })

export const updateProjectFn = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => ProjectSchema.parse(data))
  .handler(async ({ data }) => {
    if (!data.id) throw new Error('ID required for update')
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
    if (!data.id) throw new Error('ID required for update')
    const { tags: tagList, ...blogData } = data

    // Update blog
    await db
      .update(blogs)
      .set({ ...blogData, updatedAt: new Date() })
      .where(eq(blogs.id, data.id))

    // Update tags: delete all and re-insert
    await db.delete(tags).where(eq(tags.blogId, data.id))

    if (tagList.length > 0) {
      await db.insert(tags).values(
        tagList.map((tag) => ({
          tag,
          blogId: data.id,
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
