import { createFileRoute } from '@tanstack/react-router'
import { getPublicBlogsFn, getPublicTagsFn } from '@/functions/blogs'
import { getPublicProjectsFn } from '@/functions/projects'
import { getUrlDetails } from '@/lib/seo-utils'

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        const blogsData = await getPublicBlogsFn({ data: { pageSize: 1000 } })
        const tagsData = await getPublicTagsFn()
        const projectsData = await getPublicProjectsFn()

        const baseUrl = 'https://dhruvish.in'

        const staticRoutes = ['', '/contact-us', '/blogs', '/projects', '/tags']

        const blogUrls = blogsData.data.map((b) => `/blogs/${b.slug}`)
        const tagUrls = tagsData.map((tag) => `/tags/${tag}`)
        const projectUrls = projectsData.map((p) => `/projects/${p.slug}`)

        const urls = [...staticRoutes, ...blogUrls, ...tagUrls, ...projectUrls]

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
