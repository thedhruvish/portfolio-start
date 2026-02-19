import { createFileRoute } from '@tanstack/react-router'
import { getPublicBlogsFn } from '@/functions/blogs'
import { CONFIG } from '@/config/config'

export const Route = createFileRoute('/rss.xml')({
  server: {
    handlers: {
      GET: async () => {
        const blogsData = await getPublicBlogsFn({ data: { pageSize: 1000 } })

        const baseUrl = 'https://dhruvish.in'

        const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${CONFIG.fullName} | ${CONFIG.title}</title>
    <link>${baseUrl}</link>
    <description>${CONFIG.description}</description>
    <language>en-us</language>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    ${blogsData.data
      .map((blog) => {
        return `
    <item>
      <title><![CDATA[${blog.title}]]></title>
      <link>${baseUrl}/blogs/${blog.slug}</link>
      <description><![CDATA[${blog.description || ''}]]></description>
      <pubDate>${new Date(blog.createdAt ?? new Date()).toUTCString()}</pubDate>
      <guid>${baseUrl}/blogs/${blog.slug}</guid>
    </item>`
      })
      .join('')}
  </channel>
</rss>`

        return new Response(rssFeed, {
          headers: {
            'Content-Type': 'application/xml',
          },
        })
      },
    },
  },
})
