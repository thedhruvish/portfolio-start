import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/db'
import { profile, projects } from '@/db/schema'

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
