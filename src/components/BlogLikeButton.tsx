import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Heart } from 'lucide-react'
import { useDebounce } from 'use-debounce'
import { updateBlogLikesFn } from '@/functions/blogs'
import { cn } from '@/lib/utils'

interface BlogLikeButtonProps {
  blogId: number
  initialLikes: number
}

export const BlogLikeButton = ({
  blogId,
  initialLikes,
}: BlogLikeButtonProps) => {
  const [likes, setLikes] = useState(initialLikes)
  const [sessionLikes, setSessionLikes] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [debouncedSessionLikes] = useDebounce(sessionLikes, 1000)
  const prevDebouncedSessionLikesRef = useRef(0)

  // Floating hearts animation state
  const [hearts, setHearts] = useState<
    Array<{ id: number; x: number; y: number }>
  >([])

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setLikes((prev) => prev + 1)
    setSessionLikes((prev) => prev + 1)
    setIsLiked(true)

    const x = Math.random() * 40 - 20
    const id = Date.now() + Math.random()

    setHearts((prev) => [...prev, { id, x, y: 0 }])
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== id))
    }, 1000)
  }

  // Effect to save likes when debounced value changes
  useEffect(() => {
    if (debouncedSessionLikes > prevDebouncedSessionLikesRef.current) {
      const increment =
        debouncedSessionLikes - prevDebouncedSessionLikesRef.current
      if (increment > 0) {
        updateBlogLikesFn({ data: { id: blogId, likes: increment } })
        prevDebouncedSessionLikesRef.current = debouncedSessionLikes
      }
    }
  }, [debouncedSessionLikes, blogId])

  return (
    <div className="relative">
      <motion.button
        whileTap={{ scale: 0.8 }}
        onClick={handleClick}
        className={cn(
          'group flex flex-col items-center justify-center gap-1 p-3 rounded-full transition-colors',
          'hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20',
          isLiked ? 'text-red-500' : 'text-muted-foreground',
        )}
      >
        <div className="relative">
          <Heart
            className={cn(
              'w-8 h-8 transition-all duration-300',
              isLiked && 'fill-current',
            )}
          />
          {/* Burst Animation Ring */}
          <AnimatePresence>
            {isLiked && (
              <motion.div
                initial={{ scale: 0.8, opacity: 1 }}
                animate={{ scale: 1.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 rounded-full border-2 border-red-500"
              />
            )}
          </AnimatePresence>
        </div>

        <span className="text-sm font-medium tabular-nums px-2 py-0.5 rounded-full bg-muted/30 min-w-[3ch] text-center">
          {likes}
        </span>
      </motion.button>

      {/* Floating Hearts */}
      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ opacity: 1, y: 0, x: heart.x, scale: 0.5 }}
            animate={{ opacity: 0, y: -100, x: heart.x * 1.5, scale: 1.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
            style={{ color: '#ef4444' }} // Red-500
          >
            <Heart className="w-5 h-5 fill-current" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
