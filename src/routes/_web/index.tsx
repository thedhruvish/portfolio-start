import { createFileRoute } from '@tanstack/react-router'
import Github from '@/components/Github'
import { HeroSection } from '@/components/Hero-section'
import { Projects } from '@/components/Projects'
import { getProfileFn } from '@/functions/admin'

export const Route = createFileRoute('/_web/')({
  component: RouteComponent,
  loader: async () => await getProfileFn(),
})

function RouteComponent() {
  const profile = Route.useLoaderData()
  return (
    <>
      <HeroSection profile={profile} />
      <Projects />
      <Github />
    </>
  )
}
