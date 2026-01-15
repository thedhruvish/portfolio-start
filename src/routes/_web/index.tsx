import { Await, Link, createFileRoute, defer } from '@tanstack/react-router'
import { Suspense } from 'react'
import { BlogCard } from '@/components/BlogCard'
import { BlogsSkeleton } from '@/components/BlogsSkeleton'
import Container from '@/components/Container'
import Github from '@/components/Github'
import { HeroSection } from '@/components/Hero-section'
import { Projects } from '@/components/Projects'
import { ProjectsSkeleton } from '@/components/ProjectsSkeleton'
import { getProfileFn } from '@/functions/admin'
import { getLatestBlogsFn } from '@/functions/blogs'
import { getPublicProjectsFn } from '@/functions/projects'
// ...

export const Route = createFileRoute('/_web/')({
  component: RouteComponent,
  loader: async () => {
    const profile = await getProfileFn()
    const latestBlogs = getLatestBlogsFn()
    const projects = getPublicProjectsFn()
    return {
      profile,
      latestBlogs: defer(latestBlogs),
      projects: defer(projects),
    }
  },
})

function RouteComponent() {
  const { profile, latestBlogs, projects } = Route.useLoaderData()

  return (
    <>
      <Container>
        <HeroSection profile={profile} />
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
