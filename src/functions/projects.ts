import { createServerFn } from '@tanstack/react-start'
import { desc } from 'drizzle-orm'
import { db } from '@/db'
import { projects } from '@/db/schema'

export const getPublicProjectsFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const data = await db.select().from(projects).orderBy(desc(projects.id))
    return data
  },
)
