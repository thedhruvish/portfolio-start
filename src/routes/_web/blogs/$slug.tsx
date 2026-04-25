import { useState } from 'react'
import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { Calendar, ChevronLeft } from 'lucide-react'
import dayjs from 'dayjs'
import { BlockEditor } from '@/components/block-editor/lazy'
import { BlogCard } from '@/components/BlogCard'
import { BlogDetailSkeleton } from '@/components/BlogDetailSkeleton'
import { BlogLikeButton } from '@/components/BlogLikeButton'
import Container from '@/components/Container'
import { NewsletterForm } from '@/components/NewsletterForm'
import { EnhancedImage } from '@/components/enhanced-image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CONFIG } from '@/config/config'
import { getPublicBlogBySlugFn } from '@/functions/blogs'

export const Route = createFileRoute('/_web/blogs/$slug')({
  loader: async ({ params: { slug } }) => {
    const blog = await getPublicBlogBySlugFn({ data: slug })
    if (!blog) throw notFound()
    return { blog }
  },
  head: ({ loaderData }) => {
    if (!loaderData) throw notFound()
    return {
      meta: [
        { title: loaderData.blog.title || CONFIG.title },
        {
          name: 'description',
          content:
            loaderData.blog.description ||
            loaderData.blog.title ||
            CONFIG.description,
        },
        {
          name: 'keywords',
          content: loaderData.blog.tags.join(', '),
        },
        {
          property: 'og:title',
          content: loaderData.blog.title || CONFIG.title,
        },
        {
          property: 'og:description',
          content:
            loaderData.blog.description ||
            loaderData.blog.title ||
            CONFIG.description,
        },
        {
          property: 'og:image',
          content: loaderData.blog.thumbImage || CONFIG.ogImage,
        },
        { property: 'og:type', content: 'article' },
        { name: 'twitter:card', content: 'summary_large_image' },
        {
          name: 'twitter:title',
          content: loaderData.blog.title || CONFIG.title,
        },
        {
          name: 'twitter:description',
          content:
            loaderData.blog.description ||
            loaderData.blog.title ||
            CONFIG.description,
        },
        {
          name: 'twitter:image',
          content: loaderData.blog.thumbImage || CONFIG.ogImage,
        },
      ],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: loaderData.blog.title,
            description: loaderData.blog.description,
            image: loaderData.blog.thumbImage,
            author: {
              '@type': 'Person',
              name: CONFIG.name,
            },
            datePublished: loaderData.blog.createdAt,
          }),
        },
      ],
    }
  },
  headers: () => ({
    'Cache-Control':
      'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    'CDN-Cache-Control': 'max-age=3600',
  }),

  component: BlogDetailComponent,
  staleTime: 5 * 60_000,
  pendingComponent: BlogDetailSkeleton,
})

function BlogDetailComponent() {
  const { blog } = Route.useLoaderData()

  if (!blog) throw notFound()

  const [likes, setLikes] = useState(blog.likes || 0)
  const [isLiked, setIsLiked] = useState(false)

  const handleLike = () => {
    setLikes((prev: number) => prev + 1)
    setIsLiked(true)
  }

  return (
    <Container key={blog.id} className="py-10 max-w-4xl space-y-8 relative">
      <div className="hidden lg:block">
        <div className="absolute top-10 -left-20">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="rounded-full h-12 w-12 hover:bg-muted/80 backdrop-blur-sm"
          >
            <Link to="/blogs" aria-label="Back to blogs">
              <ChevronLeft className="w-6 h-6" />
            </Link>
          </Button>
        </div>

        <div className="absolute top-10 -right-20">
          <BlogLikeButton
            blogId={blog.id}
            likes={likes}
            isLiked={isLiked}
            onLike={handleLike}
          />
        </div>
      </div>
      {/* Mobile: Back Button & Like Button Row */}
      <div className="lg:hidden mb-6 flex items-center justify-between">
        <Button
          variant="ghost"
          asChild
          className="-ml-4 gap-1 text-muted-foreground"
        >
          <Link to="/blogs">
            <ChevronLeft className="w-4 h-4" />
            Back to Blogs
          </Link>
        </Button>
        <BlogLikeButton
          blogId={blog.id}
          likes={likes}
          isLiked={isLiked}
          onLike={handleLike}
        />
      </div>
      {/* Hero Section */}
      <div className="space-y-6 text-center">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {blog.tags.map((tag: string) => (
            <Link key={tag} to="/tags/$name" params={{ name: tag }}>
              <Badge variant="secondary" className="hover:bg-secondary/80 cursor-pointer">
                {tag}
              </Badge>
            </Link>
          ))}
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl text-balance">
          {blog.title}
        </h1>
        {blog.createdAt && (
          <div className="flex items-center justify-center text-muted-foreground text-sm gap-2">
            <Calendar className="w-4 h-4" />
            <span>
              Published {dayjs(blog.createdAt).format('MMMM D, YYYY')}
            </span>
          </div>
        )}
      </div>
      {/* Featured Image */}
      {blog.thumbImage && (
        <EnhancedImage
          src={blog.thumbImage}
          alt={blog.title}
          className="aspect-video border shadow-sm rounded-xl overflow-hidden"
        />
      )}
      {/* Content */}
      <div className="prose prose-lg dark:prose-invert mx-auto max-w-none">
        <BlockEditor
          value={blog.content}
          readOnly={true}
          className="border-none p-0 min-h-0 bg-transparent"
        />
      </div>
      <hr className="border-border/50" />

      {/* Like Section */}
      <div className="flex flex-col items-center justify-center gap-4 py-8">
        <p className="text-muted-foreground font-medium">
          Enjoyed this post? Give it some love!
        </p>
        <BlogLikeButton
          blogId={blog.id}
          likes={likes}
          isLiked={isLiked}
          onLike={handleLike}
        />
      </div>
      <hr className="border-border/50" />
      {/* Suggested Blogs */}
      {blog.suggestions.length > 0 && (
        <div className="space-y-8 py-8">
          <h3 className="text-2xl font-bold tracking-tight">
            You might also like
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blog.suggestions.map((suggestion) => (
              <BlogCard key={suggestion.id} blog={suggestion} />
            ))}
          </div>
        </div>
      )}
      {/* Newsletter */}
      <div className="py-8">
        <NewsletterForm />
      </div>
    </Container>
  )
}
