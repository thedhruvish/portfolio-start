export interface NavItem {
  label: string
  href: string
}
export const CONFIG = {
  name: 'Dhruvish ',
  fullName: 'Dhruvish Lathiya',
  title: 'Backend dev',
  description: "Freelancer | Let's work together",
  profilePic: 'https://github.com/thedhruvish.png',
  SOCIAL_MEDIA: {
    github: 'https://github.com/thedhruvish',
    linkedin: 'https://linkedin.com/in/dhruvishlathiya',
    x: 'https://x.com/dhruvishlathiya',
    cal: 'https://cal.com/dhruvishlathiya/30min?overlayCalendar=true',
    email: 'thedhruvish@gmail.com',
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
