import { ArrowRight, CalendarDays } from 'lucide-react'

import { Link } from 'next-view-transitions-react-19'
import { MotionLi } from './ClientMotion'
import { getPublishedBlogPosts } from '@/lib/blog'

const formatterDE = new Intl.DateTimeFormat('de-DE', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})
export const RecentPosts = () => {
  const posts = getPublishedBlogPosts(3)
  return (
    <section className="mt-20">
      {/* Section Header */}
      <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          Recent Posts
        </h2>

        <Link
          href="/blog"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          View all posts →
        </Link>
      </div>

      {/* Post List */}
      <ul className="flex flex-col gap-8">
        {posts.map((post, index) => (
          <MotionLi
            key={post.slug}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <article className="group rounded-xl border bg-card/50 p-6 shadow-sm transition-all hover:shadow-md dark:hover:bg-muted/40">
              {/* Title */}
              <Link href={`/blog/${post.slug}`} className="block">
                <h3 className="text-xl font-semibold transition-colors group-hover:text-foreground md:text-2xl">
                  {post.frontmatter.title}
                </h3>
              </Link>

              {/* Metadata */}
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4" aria-hidden="true" />
                <time dateTime={post.frontmatter.date}>
                  {formatterDE.format(new Date(post.frontmatter.date))}
                </time>
              </div>

              {/* Description */}
              <p className="mt-4 text-base text-muted-foreground line-clamp-2">
                {post.frontmatter.description}
              </p>

              {/* Read More */}
              <Link
                href={`/blog/${post.slug}`}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <div className="mt-5 flex items-center gap-1 text-sm font-medium text-muted-foreground transition-all group-hover:text-foreground">
                  Read more
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </article>
          </MotionLi>
        ))}
      </ul>
    </section>
  )
}
