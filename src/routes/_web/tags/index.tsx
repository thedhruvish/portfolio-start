import { createFileRoute, Link } from '@tanstack/react-router'
import { getPublicTagsFn } from '@/functions/blogs'
import { Badge } from '@/components/ui/badge'
import Container from '@/components/Container'
import { CONFIG } from '@/config/config'
import { Hash } from 'lucide-react'

export const Route = createFileRoute('/_web/tags/')({
  loader: async () => {
    const tags = await getPublicTagsFn()
    return { tags }
  },
  component: TagsComponent,
  head: () => ({
    meta: [
      {
        title: `Tags | ${CONFIG.title}`,
        content: 'Browse articles by topic and tag.',
      },
      {
        name: 'description',
        content: 'Browse articles by topic and tag.',
      },
      {
        property: 'og:title',
        content: `Tags | ${CONFIG.title}`,
      },
      {
        property: 'og:description',
        content: 'Browse articles by topic and tag.',
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: `Tags | ${CONFIG.title}` },
      {
        name: 'twitter:description',
        content: 'Browse articles by topic and tag.',
      },
    ],
  }),
})

function TagsComponent() {
  const { tags: availableTags } = Route.useLoaderData()

  return (
    <Container className="py-10 space-y-10">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
          Browse by Tags
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Explore articles organized by topics and technologies.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 py-8">
        {availableTags && availableTags.length > 0 ? (
          availableTags.map((tag) => (
            <Link
              key={tag}
              to="/tags/$name"
              params={{ name: tag }}
              className="transition-transform hover:scale-105 active:scale-95"
            >
              <Badge
                variant="outline"
                className="px-6 py-2 text-base font-medium flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Hash className="w-4 h-4 opacity-70" />
                {tag}
              </Badge>
            </Link>
          ))
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            No tags found.
          </div>
        )}
      </div>
    </Container>
  )
}
