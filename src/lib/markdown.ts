import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeStringify from 'rehype-stringify'
import rehypeHighlight from 'rehype-highlight'
import { visit } from 'unist-util-visit'

export async function markdownToHtml(markdown: string) {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeHighlight, { detect: true })
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: 'append',
      properties: {
        ariaLabel: 'Link to self',
        className: ['anchor'],
      },
    })
    .use(() => (tree) => {
      visit(tree, 'element', (node: any) => {
        // Handle links to open in new tab
        if (node.tagName === 'a') {
          const href = node.properties?.href || ''
          if (href.startsWith('http') || href.startsWith('//')) {
            node.properties = {
              ...(node.properties || {}),
              target: '_blank',
              rel: 'noopener noreferrer',
            }
          }
        }
      })
    })
    .use(rehypeStringify)
    .process(markdown)

  return result.toString()
}
