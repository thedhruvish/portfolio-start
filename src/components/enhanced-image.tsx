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
  /* ───────────── STATE ───────────── */
  const [isOpen, setIsOpen] = React.useState(false)
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [hasError, setHasError] = React.useState(false)

  /* ───────────── IMAGE REF (CRITICAL FOR SHIMMER FIX) ───────────── */
  const imgRef = React.useRef<HTMLImageElement | null>(null)

  /* ───────────── STABLE ID ───────────── */
  const idRef = React.useRef<string>(crypto.randomUUID())
  const id = idRef.current

  /* ───────────── MOTION VALUES ───────────── */
  const scale = useMotionValue(1)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const resetTransform = () => {
    scale.set(1)
    x.set(0)
    y.set(0)
  }

  /* ───────────── RESET ON SRC CHANGE ───────────── */
  React.useEffect(() => {
    setIsLoaded(false)
    setHasError(false)
    resetTransform()
  }, [src])

  /* ───────────── SHIMMER FIX (CACHED IMAGE HANDLING) ───────────── */
  React.useEffect(() => {
    const img = imgRef.current
    if (!img) return

    // ✅ If image is cached, onLoad may not fire
    if (img.complete && img.naturalWidth > 0) {
      setIsLoaded(true)
    }
  }, [src])

  /* ───────────── DEVICE DETECTION ───────────── */
  const isTouchDevice =
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0)

  /* ───────────── ESC + SCROLL LOCK ───────────── */
  React.useEffect(() => {
    if (!isOpen) return

    const prevOverflow = document.body.style.overflow

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKeyDown)
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
        onClick={() => !hasError && setIsOpen(true)}
      >
        {/* ✅ SHIMMER */}
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 animate-pulse bg-muted" />
        )}

        <motion.img
          ref={imgRef}
          layoutId={`image-${id}`}
          src={hasError ? fallbackSrc : src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={cn(
            'h-full w-full object-cover transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0',
          )}
          {...props}
        />

        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <ImageOff className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
      </motion.div>

      {/* ───────────── FULLSCREEN VIEWER ───────────── */}
      <AnimatePresence>
        {isOpen && !hasError && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={alt}
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
                src={src}
                alt={alt}
                style={{ scale, x, y }}
                drag={isTouchDevice ? 'y' : false}
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
