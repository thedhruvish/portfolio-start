import { useState } from 'react'
import { Check, Copy, Linkedin, Share2, Twitter } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from './ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import XIcon from './svgs/X'
import LinkedInIcon from './svgs/LinkedIn'
import WhatsappIcon from './svgs/Whatsapp'
import CopyIcon from './svgs/Copy'
import CopiedIcon from './svgs/Copied'

interface BlogShareProps {
  title: string
  url: string
}

const PeerlistIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 18.258c-3.456 0-6.258-2.802-6.258-6.258 0-3.456 2.802-6.258 6.258-6.258 3.456 0 6.258 2.802 6.258 6.258 0 3.456-2.802 6.258-6.258 6.258z" />
    <circle cx="12" cy="12" r="3.5" />
  </svg>
)

export function BlogShare({ title, url }: BlogShareProps) {
  const [copied, setCopied] = useState(false)
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const shareLinks = [
    {
      name: 'X (Twitter)',
      icon: XIcon,
      href: `https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: 'hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black',
    },
    {
      name: 'LinkedIn',
      icon: LinkedInIcon,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: 'hover:bg-[#0077b5] hover:text-white',
    },
    {
      name: 'Peerlist',
      icon: PeerlistIcon,
      href: `https://peerlist.io/share?url=${encodedUrl}&title=${encodedTitle}`,
      color: 'hover:bg-[#00AA45] hover:text-white',
    },
    {
      name: 'WhatsApp',
      icon: WhatsappIcon,
      href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      color: 'hover:bg-[#25D366] hover:text-white',
    },
  ]

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success('Link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error('Failed to copy link')
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Share this post</p>
      <div className="flex flex-wrap justify-center gap-2">
        <TooltipProvider>
          {shareLinks.map((link) => (
            <Tooltip key={link.name}>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={`rounded-full transition-all duration-300 ${link.color}`}
                  asChild
                >
                  <a href={link.href} target="_blank" rel="noopener noreferrer">
                    <link.icon className="h-4 w-4" />
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{link.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
                onClick={copyToClipboard}
              >
                {copied ? <CopiedIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{copied ? 'Copied!' : 'Copy link'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
