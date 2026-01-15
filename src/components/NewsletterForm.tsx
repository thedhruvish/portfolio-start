import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CheckCircle2, Loader2, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { subscribeToNewsletterFn } from '@/functions/subscribers'

export const NewsletterForm = () => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    try {
      const res = await subscribeToNewsletterFn({ data: { email } })
      if (res.success) {
        setStatus('success')
        setMessage(res.message)
        setEmail('')
      } else {
        setStatus('error')
        setMessage('Something went wrong. Please try again.')
      }
    } catch (err) {
      setStatus('error')
      setMessage('Failed to subscribe. Please try again.')
    }
  }

  return (
    <div className="rounded-2xl border bg-muted/30 p-8 text-center md:p-12">
      <div className="mx-auto max-w-lg space-y-4">
        <div className="flex justify-center">
          <div className="p-3 rounded-full bg-primary/10 text-primary">
            <Mail className="w-6 h-6" />
          </div>
        </div>
        <h3 className="text-2xl font-bold">Subscribe to my newsletter</h3>
        <p className="text-muted-foreground">
          Get the latest posts and updates delivered directly to your inbox.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 sm:flex-row max-w-md mx-auto pt-4"
        >
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading' || status === 'success'}
            className="bg-background"
            required
          />
          <Button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
          >
            {status === 'loading' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : status === 'success' ? (
              <CheckCircle2 className="mr-2 h-4 w-4" />
            ) : null}
            {status === 'success' ? 'Subscribed' : 'Subscribe'}
          </Button>
        </form>

        <AnimatePresence mode="wait">
          {message && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={`text-sm font-medium ${status === 'success' ? 'text-green-500' : 'text-red-500'}`}
            >
              {message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
