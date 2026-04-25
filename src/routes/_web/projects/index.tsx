import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { getPublicProjectsFn } from '@/functions/projects'
import { Projects } from '@/components/Projects'
import Container from '@/components/Container'
import { CONFIG } from '@/config/config'

export const Route = createFileRoute('/_web/projects/')({
  component: ProjectsPage,
  loader: async () => {
    const projects = await getPublicProjectsFn()
    return { projects }
  },
  head: ({ loaderData }) => {
    const projects = loaderData?.projects || []
    const siteUrl = `${CONFIG.siteUrl}/projects`

    return {
      meta: [
        { title: `Projects | ${CONFIG.title}` },
        { name: 'description', content: 'Check out my latest projects and open source contributions.' },
        { property: 'og:title', content: `Projects | ${CONFIG.title}` },
        { property: 'og:description', content: 'Check out my latest projects and open source contributions.' },
        { property: 'og:image', content: CONFIG.ogProject },
        { property: 'og:url', content: siteUrl },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: `Projects | ${CONFIG.title}` },
        { name: 'twitter:description', content: 'Check out my latest projects and open source contributions.' },
        { name: 'twitter:image', content: CONFIG.ogProject },
      ],
      links: [{ rel: 'canonical', href: siteUrl }],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            itemListElement: projects.map((project, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              item: {
                '@type': 'CreativeWork',
                name: project.title,
                description: project.description,
                image: project.image,
                url: project.link || project.github,
              },
            })),
          }),
        },
      ],
    }
  },
})

function ProjectsPage() {
  const { projects } = Route.useLoaderData()
  const [selectedTech, setSelectedTech] = useState<string | null>(null)

  const filteredProjects = selectedTech
    ? projects.filter((p) => p.tech?.includes(selectedTech))
    : projects

  return (
    <Container className="py-10">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl mb-4">
          All Projects
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          A collection of projects I've worked on, ranging from web applications
          to open source tools.
        </p>
      </div>

      <div className="space-y-8">
        {selectedTech && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 w-fit px-3 py-1 rounded-full">
            <span>Filtering by: <span className="font-bold text-foreground">{selectedTech}</span></span>
            <button 
              onClick={() => setSelectedTech(null)}
              className="hover:text-primary underline underline-offset-2"
            >
              Clear
            </button>
          </div>
        )}
        
        <Projects 
          projects={filteredProjects} 
          selectedTech={selectedTech}
          onTechSelect={setSelectedTech}
        />
        
        {filteredProjects.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            No projects found with this technology.
          </div>
        )}
      </div>
    </Container>
  )
}
