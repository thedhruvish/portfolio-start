import { createFileRoute, notFound } from '@tanstack/react-router'
import parse from 'html-react-parser'
import { getProjectBySlugFn } from '@/functions/projects'
import { markdownToHtml } from '@/lib/markdown'
import Container from '@/components/Container'
import { TechIconsMap } from '@/config/tech-icons-map'
import { Badge } from '@/components/ui/badge'
import { Github, ExternalLink, ArrowLeft } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { CONFIG } from '@/config/config'

export const Route = createFileRoute('/_web/projects/$slug')({
  loader: async ({ params }) => {
    const project = await getProjectBySlugFn({ data: params.slug })
    if (!project) {
      throw notFound()
    }
    const contentHtml = await markdownToHtml(project.details || '')
    return { project, contentHtml }
  },
  head: ({ loaderData }) => {
    const project = loaderData?.project
    if (!project) return {}

    const title = `${project.title} | ${CONFIG.name} Project`
    const description = project.description
    const siteUrl = `${CONFIG.siteUrl}/projects/${project.slug}`
    const image = project.image || CONFIG.ogProject

    return {
      meta: [
        { title },
        { name: 'description', content: description },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:image', content: image },
        { property: 'og:url', content: siteUrl },
        { property: 'og:type', content: 'article' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: image },
      ],
      links: [
        { rel: 'canonical', href: siteUrl }
      ],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            name: project.title,
            description: project.description,
            image: image,
            url: siteUrl,
            author: {
              '@type': 'Person',
              name: CONFIG.fullName,
            },
            keywords: project.tech?.join(', '),
          }),
        },
      ],
    }
  },
  component: ProjectDetails,
})

function ProjectDetails() {
  const { project, contentHtml } = Route.useLoaderData()

  return (
    <Container className="pb-20">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-6 -ml-4 text-muted-foreground hover:text-foreground">
          <Link to="/projects">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to projects
          </Link>
        </Button>

        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            {project.title}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {project.description}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          {project.github && (
            <Button asChild variant="outline" className="rounded-full">
              <a href={project.github} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" /> GitHub Repository
              </a>
            </Button>
          )}
          {project.link && (
            <Button asChild className="rounded-full">
              <a href={project.link} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
              </a>
            </Button>
          )}
        </div>
      </div>

      {project.image && (
        <div className="mb-12 aspect-video overflow-hidden rounded-2xl border bg-muted shadow-lg">
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-3">
          <article className="prose prose-neutral dark:prose-invert max-w-none">
            {parse(contentHtml)}
          </article>
        </div>

        <div className="space-y-8">
          {project.tech && project.tech.length > 0 && (
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech) => {
                  const Icon = TechIconsMap[tech]
                  return (
                    <Badge key={tech} variant="secondary" className="flex items-center gap-1.5 py-1 px-3">
                      {Icon && <Icon className="size-3.5" />}
                      {tech}
                    </Badge>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </Container>
  )
}
