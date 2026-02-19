import { createFileRoute } from '@tanstack/react-router'
import { getPublicBlogsFn } from '@/functions/blogs'
import { getUrlDetails } from '@/lib/seo-utils'

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        const blogsData = await getPublicBlogsFn({ data: { pageSize: 1000 } })

        const baseUrl = 'https://dhruvish.in'

        const staticRoutes = ['', '/contact-us', '/blogs', '/projects']

        const blogUrls = blogsData.data.map((b) => `/blogs/${b.slug}`)

        const urls = [...staticRoutes, ...blogUrls]

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((url) => {
    const { priority, changefreq } = getUrlDetails(url)
    return `    <url>
        <loc>${baseUrl}${url}</loc>
        <changefreq>${changefreq}</changefreq>
        <priority>${priority}</priority>
    </url>`
  })
  .join('\n')}
</urlset>`
        return new Response(sitemap, {
          headers: {
            'Content-Type': 'application/xml',
          },
        })
      },
    },
  },
})
