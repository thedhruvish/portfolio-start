export interface NavItem {
  label: string
  href: string
}
export const CONFIG = {
  name: 'Dhruvish ',
  fullName: 'Dhruvish Lathiya',
  siteUrl: 'https://dhruvish.in',
  title: 'Software Engineer | Dhruvish',
  description: "Seeking opportunities | Freelancer | Let's work together",
  profilePic: 'https://github.com/thedhruvish.png',
  ogImage: 'https://dhruvish.in/og.png',
  ogProject: 'https://dhruvish.in/og-project.png',
  ogBlog: 'https://dhruvish.in/og-blog.png',
  SOCIAL_MEDIA: {
    github: 'https://github.com/thedhruvish',
    linkedin: 'https://linkedin.com/in/dhruvishlathiya',
    x: 'https://x.com/dhruvishlathiya',
    // cal: 'https://cal.com/dhruvishlathiya/30min?overlayCalendar=true',
    email: 'info@dhruvish.in',
    githubUsername: 'thedhruvish',
  },
  navItems: [
    {
      label: 'Blogs',
      href: '/blogs',
    },
    {
      label: 'Contact ',
      href: '/contact-us',
    },
  ] as Array<NavItem>,
}
