import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery, useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { Suspense, useEffect, useRef, useState } from 'react'
import { Loader2, Search } from 'lucide-react'
import { z } from 'zod'
import { useInView } from 'motion/react'
import { useDebounce } from 'use-debounce'
import { getPublicBlogsFn, getPublicTagsFn } from '@/functions/blogs'
import { BlogCard } from '@/components/BlogCard'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import Container from '@/components/Container'
import { BlogsSkeleton } from '@/components/BlogsSkeleton'

const blogSearchSchema = z.object({
  search: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

export const Route = createFileRoute('/_web/blogs/')({
  validateSearch: (search) => blogSearchSchema.parse(search),

  loaderDeps: ({ search: { search, tags } }) => ({ search, tags }),
  component: BlogListComponent,
})

function BlogGrid({ search, tags }: { search?: string; tags?: Array<string> }) {
  const ref = useRef(null)
  const InView = useInView(ref)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery({
      queryKey: ['public-blogs', search, tags],
      queryFn: async ({ pageParam }) => {
        return await getPublicBlogsFn({
          data: {
            cursor: pageParam,
            pageSize: 9,
            search: search || undefined,
            tags: tags || undefined,
          },
        })
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
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
        No articles found matching your criteria.
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

function BlogListComponent() {
  const { search, tags } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const [searchInput, setSearchInput] = useState(search || '')
  const [debouncedSearch] = useDebounce(searchInput, 1300, { leading: true })

  useEffect(() => {
    if (debouncedSearch !== search) {
      navigate({
        search: (prev) => ({ ...prev, search: debouncedSearch || undefined }),
        replace: true,
      })
    }
  }, [debouncedSearch])

  // Fetch Tags with useQuery (non-suspense to avoid blocking shell)
  const { data: availableTags } = useQuery({
    queryKey: ['public-tags'],
    queryFn: () => getPublicTagsFn(),
  })

  const handleTagChange = (val: string) => {
    if (val === 'All') {
      navigate({
        search: (prev) => ({ ...prev, tags: undefined }),
        replace: true,
      })
      return
    }

    const currentTags = tags || []
    let newTags

    if (currentTags.includes(val)) {
      newTags = currentTags.filter((t) => t !== val)
    } else {
      newTags = [...currentTags, val]
    }

    navigate({
      search: (prev) => ({
        ...prev,
        tags: newTags.length > 0 ? newTags : undefined,
      }),
      replace: true,
    })
  }

  return (
    <Container className="py-10 space-y-10">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
          Our Blog
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Thoughts, tutorials, and insights on web development and more.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-muted/30 p-4 rounded-lg border border-border/50">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            value={searchInput || ''}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9 bg-background"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          <div className="flex gap-2">
            <Badge
              variant={!tags || tags.length === 0 ? 'default' : 'outline'}
              className="cursor-pointer whitespace-nowrap"
              onClick={() => handleTagChange('All')}
            >
              All
            </Badge>
            {(availableTags || []).map((t) => (
              <Badge
                key={t}
                variant={tags?.includes(t) ? 'default' : 'outline'}
                className="cursor-pointer whitespace-nowrap"
                onClick={() => handleTagChange(t)}
              >
                {t}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <BlogsSkeleton count={6} />
          </div>
        }
      >
        <BlogGrid search={search} tags={tags} />
      </Suspense>
    </Container>
  )
}
