import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface BlogCardProps {
  blog: {
    title: string
    slug: string
    description: string | null
    thumbImage: string | null
    published: boolean | null
    createdAt: Date | null
    tags: Array<string>
  }
  className?: string
  index?: number
}

export const BlogCard = ({ blog, className, index = 0 }: BlogCardProps) => {
  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (index % 9) * 0.1, duration: 0.4 }}
      className="h-full list-none"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{
          repeat: Infinity,
          duration: 4,
          ease: 'easeInOut',
          delay: (index % 9) * 0.2,
        }}
        className="h-full"
      >
        <div className="group block h-full overflow-hidden rounded-xl transition-all duration-300">
          <Link
            to="/blogs/$slug"
            params={{ slug: blog.slug }}
            className="block"
          >
            {/* Thumbnail Image */}
            <div className="relative aspect-video w-full overflow-hidden bg-muted rounded-xl">
              {blog.thumbImage ? (
                <img
                  src={blog.thumbImage}
                  alt={blog.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-secondary text-secondary-foreground">
                  <span className="text-4xl font-bold opacity-20">Blog</span>
                </div>
              )}
            </div>
          </Link>

          <div className="py-4 space-y-4">
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <Link
                  key={tag}
                  to="/tags/$name"
                  params={{ name: tag }}
                  className="z-10"
                >
                  <Badge
                    variant="outline"
                    className="text-xs font-normal border-primary/20 text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                  >
                    #{tag}
                  </Badge>
                </Link>
              ))}
            </div>

            <Link
              to="/blogs/$slug"
              params={{ slug: blog.slug }}
              className="block space-y-2"
            >
              {/* Title */}
              <h3 className="line-clamp-2 text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
                {blog.title}
              </h3>

              {/* Description */}
              {blog.description && (
                <p className="line-clamp-3 text-sm text-muted-foreground leading-relaxed">
                  {blog.description}
                </p>
              )}

              {/* Read More Link */}
              <div className="pt-2 flex items-center text-sm font-medium text-primary">
                Read Article
                <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.li>
  )
}
