import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { ArrowRight, Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

dayjs.extend(relativeTime)

interface BlogCardProps {
  blog: {
    title: string
    slug: string
    description: string | null
    thumbImage: string | null
    published: boolean
    createdAt: Date | null
    tags: Array<string>
  }
  className?: string
}

export const BlogCard = ({ blog, className }: BlogCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Link
        to="/blogs/$slug"
        params={{ slug: blog.slug }}
        className="block h-full"
      >
        <Card
          className={cn(
            'h-full overflow-hidden border-border/50 bg-card/50 hover:bg-card/80 hover:shadow-lg transition-all duration-300',
            className,
          )}
        >
          {/* Thumbnail Image */}
          <div className="relative aspect-video w-full overflow-hidden bg-muted">
            {blog.thumbImage ? (
              <img
                src={blog.thumbImage}
                alt={blog.title}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-secondary text-secondary-foreground">
                <span className="text-4xl font-bold opacity-20">Blog</span>
              </div>
            )}

            {/* Date Badge Overlay */}
            {blog.createdAt && (
              <div className="absolute top-4 right-4 backdrop-blur-md">
                <Badge
                  variant="secondary"
                  className="bg-background/80 hover:bg-background/90 text-xs font-normal gap-1.5 py-1"
                >
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  {dayjs(blog.createdAt).fromNow()}
                </Badge>
              </div>
            )}
          </div>

          <CardContent className="p-6 space-y-4">
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-xs font-normal border-primary/20 text-primary hover:bg-primary/10 transition-colors"
                >
                  #{tag}
                </Badge>
              ))}
            </div>

            <div className="space-y-2">
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
            </div>

            {/* Read More Link (Visual only since whole card is link) */}
            <div className="pt-2 flex items-center text-sm font-medium text-primary">
              Read Article
              <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
