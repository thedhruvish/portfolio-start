import { useState, useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import parse from 'html-react-parser'
import { markdownToHtml } from '@/lib/markdown'
import { cn } from '@/lib/utils'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  detailsUrl?: string
  placeholder?: string
  className?: string
}

export function MarkdownEditor({
  value,
  onChange,
  detailsUrl,
  placeholder,
  className,
}: MarkdownEditorProps) {
  const [html, setHtml] = useState('')
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write')

  useEffect(() => {
    if (activeTab === 'preview') {
      const getMarkdown = async () => {
        if (detailsUrl) {
          try {
            const res = await fetch(detailsUrl)
            if (res.ok) return await res.text()
          } catch (e) {
            console.error('Preview fetch failed', e)
          }
        }
        return value
      }

      getMarkdown().then(md => markdownToHtml(md, detailsUrl).then(setHtml))
    }
  }, [value, activeTab, detailsUrl])

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <div className="flex items-center justify-between mb-2">
          <TabsList>
            <TabsTrigger value="write">Write</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <span className="text-xs text-muted-foreground">Markdown supported</span>
        </div>
        
        <TabsContent value="write" className="mt-0">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="min-h-[400px] font-mono text-sm resize-y"
          />
        </TabsContent>
        
        <TabsContent value="preview" className="mt-0">
          <div className="min-h-[400px] w-full rounded-md border border-input bg-background px-3 py-2 prose prose-neutral dark:prose-invert max-w-none overflow-y-auto">
            {value ? parse(html) : <p className="text-muted-foreground italic">Nothing to preview</p>}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
