import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { Suspense, useEffect, useRef } from 'react'
import { Loader2, Hash } from 'lucide-react'
import { useInView } from 'motion/react'
import { getPublicBlogsFn } from '@/functions/blogs'
import { BlogCard } from '@/components/BlogCard'
import Container from '@/components/Container'
import { BlogsSkeleton } from '@/components/BlogsSkeleton'
import { CONFIG } from '@/config/config'

export const Route = createFileRoute('/_web/tags/$name')({
  loader: async ({ params: { name } }) => {
    const blogs = await getPublicBlogsFn({
      data: {
        cursor: 0,
        pageSize: 9,
        tags: [name],
      },
    })
    return { initialBlogs: blogs }
  },
  component: TagBlogsComponent,
  head: ({ params: { name } }) => ({
    meta: [
      {
        title: `Articles tagged with #${name} | ${CONFIG.title}`,
        content: `Read articles and tutorials related to ${name}.`,
      },
      {
        name: 'description',
        content: `Read articles and tutorials related to ${name}.`,
      },
      {
        property: 'og:title',
        content: `Articles tagged with #${name} | ${CONFIG.title}`,
      },
      {
        property: 'og:description',
        content: `Read articles and tutorials related to ${name}.`,
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      {
        name: 'twitter:title',
        content: `Articles tagged with #${name} | ${CONFIG.title}`,
      },
      {
        name: 'twitter:description',
        content: `Read articles and tutorials related to ${name}.`,
      },
    ],
  }),
})

function BlogGrid({ tag, initialData }: { tag: string; initialData: any }) {
  const ref = useRef(null)
  const InView = useInView(ref)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery({
      queryKey: ['public-blogs-by-tag', tag],
      queryFn: async ({ pageParam }) => {
        return await getPublicBlogsFn({
          data: {
            cursor: pageParam,
            pageSize: 9,
            tags: [tag],
          },
        })
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialData: {
        pages: [initialData],
        pageParams: [0],
      },
    })

  useEffect(() => {
    if (InView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [InView, hasNextPage, isFetchingNextPage, fetchNextPage])

  const blogs = data.pages.flatMap((page) => page.data) || []

  if (blogs.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        No articles found for this tag.
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {blogs.map((blog, index) => (
          <BlogCard key={blog.id} blog={blog} index={index} />
        ))}
      </div>

      <div ref={ref} className="flex justify-center py-8 min-h-[50px]">
        {isFetchingNextPage && (
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        )}
        {!hasNextPage && blogs.length > 0 && (
          <p className="text-sm text-muted-foreground">
            You&apos;ve reached the end.
          </p>
        )}
      </div>
    </>
  )
}

function TagBlogsComponent() {
  const { name } = Route.useParams()
  const { initialBlogs } = Route.useLoaderData()

  return (
    <Container className="py-10 space-y-10">
      <div className="space-y-4 text-center">
        <div className="flex justify-center items-center gap-2 mb-2">
          <Hash className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl capitalize">
            {name}
          </h1>
        </div>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Articles, tutorials, and insights tagged with {name}.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <BlogsSkeleton count={6} />
          </div>
        }
      >
        <BlogGrid tag={name} initialData={initialBlogs} />
      </Suspense>
    </Container>
  )
}
