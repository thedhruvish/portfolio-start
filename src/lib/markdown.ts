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
import matter from 'gray-matter'


export async function markdownToHtml(markdown: string, baseUrl?: string) {
  // Strip frontmatter if present
  const { content } = matter(markdown)

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

        // Handle relative image paths
        if (node.tagName === 'img' && baseUrl) {
          const src = node.properties?.src || ''
          if (
            !src.startsWith('http') &&
            !src.startsWith('//') &&
            !src.startsWith('data:')
          ) {
            const baseDir = baseUrl.substring(0, baseUrl.lastIndexOf('/') + 1)
            const cleanSrc = src.startsWith('./')
              ? src.slice(2)
              : src.startsWith('/')
                ? src.slice(1)
                : src
            node.properties.src = baseDir + cleanSrc
          }
        }
      })
    })
    .use(rehypeStringify)
    .process(content)

  return result.toString()
}
