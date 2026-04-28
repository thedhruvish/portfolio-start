export const getUrlDetails = (url: string) => {
  if (url === '') {
    return { priority: '1.0', changefreq: 'monthly' }
  } else if (url === '/contact-us') {
    return { priority: '0.9', changefreq: 'yearly' }
  } else if (url === '/blogs') {
    return { priority: '0.9', changefreq: 'weekly' }
  } else if (url === '/projects') {
    return { priority: '0.9', changefreq: 'monthly' }
  } else if (url.startsWith('/projects')) {
    return { priority: '0.9', changefreq: 'monthly' }
  } else if (url === '/tag') {
    return { priority: '0.9', changefreq: 'weekly' }
  } else if (url.startsWith('/blogs/')) {
    return { priority: '0.8', changefreq: 'weekly' }
  } else if (url.startsWith('/tags/')) {
    return { priority: '0.7', changefreq: 'weekly' }
  }
  return { priority: '0.7', changefreq: 'daily' }
}
