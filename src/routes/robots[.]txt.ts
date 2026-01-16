import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      ANY: () => {
        return new Response(
          `User-agent: *
Allow: /
Disallow: /admin/
Sitemap: https://dhruvish.in/sitemap.xml`,
          {
            headers: {
              'Content-Type': 'text/plain',
            },
          },
        )
      },
    },
  },
})
