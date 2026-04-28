import { createServerFn } from '@tanstack/react-start'
import { and, asc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/db'
import { projects } from '@/db/schema/projects'

export const getPublicProjectsFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    try {
      const data = await db
        .select()
        .from(projects)
        .where(eq(projects.isPublished, true))
        .orderBy(asc(projects.order))
      return data
    } catch (error) {
      console.error('Error in getPublicProjectsFn:', error)
      throw error
    }
  },
)

export const getProjectBySlugFn = createServerFn({ method: 'GET' })
  .inputValidator((slug: string) => z.string().parse(slug))
  .handler(async ({ data: slug }) => {
    try {
      const result = await db
        .select()
        .from(projects)
        .where(and(eq(projects.slug, slug), eq(projects.isPublished, true)))
        .limit(1)
      
      return result[0] || null
    } catch (error) {
      console.error('Error in getProjectBySlugFn:', error)
      throw error
    }
  })
