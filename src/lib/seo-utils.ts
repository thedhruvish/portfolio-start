export const getUrlDetails = (url: string) => {
  if (url === '') {
    return { priority: '1.0', changefreq: 'monthly' }
  }
  if (url === '/contact-us') {
    return { priority: '0.8', changefreq: 'yearly' }
  }
  if (url === '/blogs') {
    return { priority: '0.8', changefreq: 'weekly' }
  }
  if (url === '/projects') {
    return { priority: '0.8', changefreq: 'monthly' }
  }
  if (url.startsWith('/blogs/')) {
    return { priority: '0.7', changefreq: 'yearly' }
  }
  return { priority: '0.7', changefreq: 'daily' }
}
