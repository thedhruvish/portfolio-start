import { Link, createFileRoute } from '@tanstack/react-router'
import Github from '@/components/Github'
import { HeroSection } from '@/components/Hero-section'
import { Projects } from '@/components/Projects'
import { getProfileFn } from '@/functions/admin'
import { getLatestBlogsFn } from '@/functions/blogs'
import { BlogCard } from '@/components/BlogCard'
import Container from '@/components/Container'

export const Route = createFileRoute('/_web/')({
  component: RouteComponent,
  loader: async () => {
    const [profile, latestBlogs] = await Promise.all([
      getProfileFn(),
      getLatestBlogsFn(),
    ])
    return { profile, latestBlogs }
  },
})

function RouteComponent() {
  const { profile, latestBlogs } = Route.useLoaderData()

  return (
    <>
      <HeroSection profile={profile} />
      <Projects />

      {/* Latest Blogs Section */}
      <section className="py-20">
        <Container>
          <div className="flex flex-col items-start justify-between gap-4 mb-10 sm:flex-row sm:items-end">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Recent Posts
            </h2>
            <Link
              to="/blogs"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              View all posts →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latestBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
            {latestBlogs.length === 0 && (
              <p className="text-muted-foreground col-span-full">
                No blog posts yet.
              </p>
            )}
          </div>
        </Container>
      </section>

      <Github />
    </>
  )
}
