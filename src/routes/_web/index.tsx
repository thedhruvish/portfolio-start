import { Await, Link, createFileRoute, defer } from '@tanstack/react-router'
import { Suspense } from 'react'
import { BlogCard } from '@/components/BlogCard'
import { BlogsSkeleton } from '@/components/BlogsSkeleton'
import Container from '@/components/Container'
import Github from '@/components/Github'
import { HeroSection } from '@/components/Hero-section'
import { Projects } from '@/components/Projects'
import { ProjectsSkeleton } from '@/components/ProjectsSkeleton'
import { Experiences } from '@/components/Experiences'
import { getExperiencesFn, getProfileFn } from '@/functions/admin'
import { getLatestBlogsFn } from '@/functions/blogs'
import { getPublicProjectsFn } from '@/functions/projects'
import { CONFIG } from '@/config/config'

export const Route = createFileRoute('/_web/')({
  head: ({ loaderData }) => {
    const profile = loaderData?.profile
    const title = profile?.name || CONFIG.title
    const description = profile?.description || CONFIG.description
    const siteUrl = CONFIG.siteUrl

    return {
      meta: [
        {
          title: title,
        },
        {
          name: 'description',
          content: description,
        },
        {
          name: 'keywords',
          content:
            profile?.keywords ||
            'Dhruvish Lathiya, Backend Developer, Freelancer, Node.js, PostgreSQL,Nodejs Developer, Ai developer, Drizzle ORM, React, TanStack Start',
        },
        {
          property: 'og:title',
          content: title,
        },
        {
          property: 'og:description',
          content: description,
        },
        {
          property: 'og:image',
          content: CONFIG.ogImage,
        },
        {
          property: 'og:url',
          content: siteUrl,
        },
        { property: 'og:type', content: 'profile' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        {
          name: 'twitter:description',
          content: description,
        },
        {
          name: 'twitter:image',
          content: CONFIG.ogImage,
        },
      ],
      links: [
        {
          rel: 'canonical',
          href: siteUrl,
        },
      ],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: profile?.name || CONFIG.fullName,
            jobTitle: profile?.headline || CONFIG.title,
            description: description,
            image: profile?.image || CONFIG.profilePic,
            url: siteUrl,
            sameAs: [
              CONFIG.SOCIAL_MEDIA.github,
              CONFIG.SOCIAL_MEDIA.linkedin,
              CONFIG.SOCIAL_MEDIA.x,
            ],
          }),
        },
      ],
    }
  },
  component: RouteComponent,
  loader: async () => {
    const profile = await getProfileFn()
    const latestBlogs = getLatestBlogsFn()
    const projects = getPublicProjectsFn()
    const experiences = getExperiencesFn()
    return {
      profile,
      latestBlogs: defer(latestBlogs),
      projects: defer(projects),
      experiences: defer(experiences),
    }
  },
})

function RouteComponent() {
  const { profile, latestBlogs, projects, experiences } = Route.useLoaderData()

  return (
    <>
      <Container>
        <HeroSection profile={profile} />

        {/* Experiences Section */}
        <Suspense
          fallback={
            <section className="pt-10 scroll-mt-24">
              <div className="mb-10 h-10 w-48 animate-pulse rounded bg-muted" />
              <div className="space-y-8">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-32 w-full animate-pulse rounded-xl bg-muted"
                  />
                ))}
              </div>
            </section>
          }
        >
          <Await promise={experiences}>
            {(data) => {
              if (!data || data.length === 0) return null
              return (
                <section id="experience" className="pt-10 scroll-mt-24">
                  <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
                    <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                      Experience
                    </h2>
                  </div>
                  <Experiences experiences={data} />
                </section>
              )
            }}
          </Await>
        </Suspense>

        <section id="projects" className="pt-10 scroll-mt-24">
          {/* Section Header */}
          <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Projects
            </h2>

            <Link
              to="/projects"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              View all projects →
            </Link>
          </div>
          <Suspense
            fallback={
              <ul className="flex flex-col gap-8">
                <ProjectsSkeleton />
              </ul>
            }
          >
            <Await promise={projects}>
              {(data) => <Projects projects={data} />}
            </Await>
          </Suspense>
        </section>

        {/* Latest Blogs Section */}
        <section className="pt-10 scroll-mt-24">
          <div className="flex flex-col items-start justify-between gap-4 mb-10 sm:flex-row sm:items-end">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Recent Blogs
            </h2>
            <Link
              to="/blogs"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              View all Blgos →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Suspense fallback={<BlogsSkeleton />}>
              <Await promise={latestBlogs}>
                {(blogs) => (
                  <>
                    {blogs.map((blog) => (
                      <BlogCard key={blog.id} blog={blog} />
                    ))}
                    {blogs.length === 0 && (
                      <p className="text-muted-foreground col-span-full">
                        No blog posts yet.
                      </p>
                    )}
                  </>
                )}
              </Await>
            </Suspense>
          </div>
        </section>
        <Github />
      </Container>
    </>
  )
}
