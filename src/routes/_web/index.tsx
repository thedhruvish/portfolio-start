import { createFileRoute } from '@tanstack/react-router'
import Container from '@/components/Container'
import Github from '@/components/Github'
import { HeroSection } from '@/components/Hero-section'
import { Projects } from '@/components/Projects'
import Taskbar from '@/components/Taskbar'

export const Route = createFileRoute('/_web/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Container>
        <HeroSection />

        <Projects />
        <Github />
      </Container>
      <Taskbar />
    </>
  )
}
