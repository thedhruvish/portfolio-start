import * as React from 'react'
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useMotionValue,
} from 'framer-motion'
import { ImageOff, X } from 'lucide-react'
import type { HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

interface EnhancedImageProps extends Omit<HTMLMotionProps<'img'>, 'ref'> {
  aspectRatio?: string
  fallbackSrc?: string
}

export function EnhancedImage({
  src,
  alt,
  className,
  aspectRatio = 'aspect-video',
  fallbackSrc = '/not-found.png',
  ...props
}: EnhancedImageProps) {
  /* ───────────── STATE (only what is necessary) ───────────── */
  const [isOpen, setIsOpen] = React.useState(false)

  /* ───────────── REFS (no re-render) ───────────── */
  const hasEverLoadedRef = React.useRef(false)
  const hasErrorRef = React.useRef(false)

  const id = React.useId()

  /* ───────────── MOTION VALUES ───────────── */
  const scale = useMotionValue(1)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const resetTransform = () => {
    scale.set(1)
    x.set(0)
    y.set(0)
  }

  /* ───────────── DEVICE DETECTION ───────────── */
  const isTouchDevice =
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0)

  /* ───────────── IMAGE LOAD (ONLY ONCE) ───────────── */
  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (hasEverLoadedRef.current) return

    const img = e.currentTarget
    const done = () => {
      hasEverLoadedRef.current = true
    }

    if ('decode' in img) {
      img.decode().then(done).catch(done)
    } else {
      done()
    }
  }

  const handleError = () => {
    hasErrorRef.current = true
  }

  /* ───────────── ESC KEY CLOSE ───────────── */
  React.useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
      resetTransform()
    }
  }, [isOpen])

  return (
    <LayoutGroup>
      {/* ───────────── THUMBNAIL ───────────── */}
      <motion.div
        layoutId={`container-${id}`}
        className={cn(
          'relative w-full overflow-hidden rounded-xl bg-muted cursor-zoom-in select-none',
          aspectRatio,
          className,
        )}
        onClick={() => !hasErrorRef.current && setIsOpen(true)}
      >
        {/* Shimmer ONLY before first load */}
        {!hasEverLoadedRef.current && (
          <div className="absolute inset-0 animate-pulse bg-muted" />
        )}

        <motion.img
          layoutId={`image-${id}`}
          src={hasErrorRef.current ? fallbackSrc : src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'h-full w-full object-cover transition-opacity duration-300',
            hasEverLoadedRef.current ? 'opacity-100' : 'opacity-0',
          )}
          {...props}
        />

        {hasErrorRef.current && (
          <div className="absolute inset-0 flex items-center justify-center">
            <ImageOff className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
      </motion.div>

      {/* ───────────── FULLSCREEN VIEWER ───────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/60 text-white"
              onClick={(e) => {
                e.stopPropagation()
                setIsOpen(false)
              }}
            >
              <X className="h-6 w-6" />
            </button>

            <motion.div
              layoutId={`container-${id}`}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              className="w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                layoutId={`image-${id}`}
                src={hasErrorRef.current ? fallbackSrc : src}
                alt={alt}
                style={{ scale, x, y }}
                drag={isTouchDevice && scale.get() === 1 ? 'y' : false}
                dragElastic={0.25}
                dragConstraints={{ top: 0, bottom: 0 }}
                onDragEnd={(_, info) => {
                  if (!isTouchDevice) return

                  if (info.offset.y > 120 || info.velocity.y > 800) {
                    setIsOpen(false)
                  } else {
                    y.set(0)
                  }
                }}
                initial={{ scale: 0.97 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.97 }}
                className="max-w-full max-h-full object-contain select-none"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </LayoutGroup>
  )
}
