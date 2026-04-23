import { createServerFn } from '@tanstack/react-start'
import { asc } from 'drizzle-orm'
import { db } from '@/db'
import { projects } from '@/db/schema'

export const getPublicProjectsFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const data = await db.select().from(projects).orderBy(asc(projects.order))
    return data
  },
)
