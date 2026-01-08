import { createFileRoute } from '@tanstack/react-router'
import Github from '@/components/Github'
import { HeroSection } from '@/components/Hero-section'
import { Projects } from '@/components/Projects'

export const Route = createFileRoute('/_web/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <HeroSection />
      <Projects />
      <Github />
    </>
  )
}
