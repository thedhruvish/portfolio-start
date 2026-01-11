import { createServerFn } from '@tanstack/react-start'
import { and, desc, eq, inArray, like, sql } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/db'
import { blogs, tags } from '@/db/schema'

export const getPublicBlogsFn = createServerFn({ method: 'GET' })
  .inputValidator((data: unknown) =>
    z
      .object({
        cursor: z.number().nullable().optional(),
        pageSize: z.number().default(10),
        search: z.string().optional(),
        tags: z.array(z.string()).optional(),
      })
      .parse(data),
  )
  .handler(async ({ data: { cursor, pageSize, search, tags: filterTags } }) => {
    const offset = cursor ? cursor : 0

    const filters = [eq(blogs.published, true)]
    if (search) {
      const searchLower = `%${search.toLowerCase()}%`
      filters.push(like(blogs.title, searchLower))
    }
    if (filterTags && filterTags.length > 0) {
      const subQuery = db
        .select({ id: tags.blogId })
        .from(tags)
        .where(inArray(tags.tag, filterTags))
      filters.push(inArray(blogs.id, subQuery))
    }

    const whereClause = and(...filters)

    const result = await db
      .select({
        id: blogs.id,
        title: blogs.title,
        slug: blogs.slug,
        description: blogs.description,
        thumbImage: blogs.thumbImage,
        published: blogs.published,
        createdAt: blogs.createdAt,
        updatedAt: blogs.updatedAt,
      })
      .from(blogs)
      .where(whereClause)
      .orderBy(desc(blogs.createdAt))
      .limit(pageSize)
      .offset(offset)

    // Fetch tags for these blogs
    const blogIds = result.map((b) => b.id)
    let blogsWithTags = result.map((b) => ({ ...b, tags: [] as Array<string> }))

    if (blogIds.length > 0) {
      const tagsResult = await db
        .select({
          blogId: tags.blogId,
          tag: tags.tag,
        })
        .from(tags)
        .where(sql`${tags.blogId} IN ${blogIds}`)

      const tagsMap = new Map<number, Array<string>>()
      tagsResult.forEach((t) => {
        if (!tagsMap.has(t.blogId)) tagsMap.set(t.blogId, [])
        tagsMap.get(t.blogId)?.push(t.tag)
      })

      blogsWithTags = result.map((b) => ({
        ...b,
        tags: tagsMap.get(b.id) || [],
      }))
    }

    const nextCursor = result.length === pageSize ? offset + pageSize : null

    return {
      data: blogsWithTags,
      nextCursor,
    }
  })

export const getPublicBlogBySlugFn = createServerFn({ method: 'GET' })
  .inputValidator((data: string) => z.string().parse(data))
  .handler(async ({ data: slug }) => {
    const blog = await db.query.blogs.findFirst({
      where: and(eq(blogs.slug, slug), eq(blogs.published, true)),
    })

    if (!blog) return null

    const blogTags = await db
      .select({ tag: tags.tag })
      .from(tags)
      .where(eq(tags.blogId, blog.id))

    return {
      ...blog,
      content: blog.content as any,
      tags: blogTags.map((t) => t.tag),
    }
  })

export const getLatestBlogsFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const result = await db
      .select({
        id: blogs.id,
        title: blogs.title,
        slug: blogs.slug,
        description: blogs.description,
        thumbImage: blogs.thumbImage,
        published: blogs.published,
        createdAt: blogs.createdAt,
        updatedAt: blogs.updatedAt,
      })
      .from(blogs)
      .where(eq(blogs.published, true))
      .orderBy(desc(blogs.createdAt))
      .limit(3)

    const blogIds = result.map((b) => b.id)
    if (blogIds.length === 0) return []

    const tagsResult = await db
      .select({
        blogId: tags.blogId,
        tag: tags.tag,
      })
      .from(tags)
      .where(sql`${tags.blogId} IN ${blogIds}`)

    const tagsMap = new Map<number, Array<string>>()
    tagsResult.forEach((t) => {
      if (!tagsMap.has(t.blogId)) tagsMap.set(t.blogId, [])
      tagsMap.get(t.blogId)?.push(t.tag)
    })

    return result.map((b) => ({
      ...b,
      tags: tagsMap.get(b.id) || [],
    }))
  },
)

export const getPublicTagsFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const result = await db
      .selectDistinct({ tag: tags.tag })
      .from(tags)
      .orderBy(tags.tag)
    return result.map((r) => r.tag)
  },
)
