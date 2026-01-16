import { createFileRoute } from '@tanstack/react-router'
import Container from '@/components/Container'
import { ContactPage } from '@/components/contact-page'

import { CONFIG } from '@/config/config'

export const Route = createFileRoute('/_web/contact-us')({
  component: ContactUs,
  head: () => ({
    meta: [
      {
        title: `Contact Us | ${CONFIG.title}`,
        content: 'Get in touch with us.',
      },
      {
        name: 'description',
        content: 'Get in touch with us.',
      },
      {
        property: 'og:title',
        content: `Contact Us | ${CONFIG.title}`,
      },
      {
        property: 'og:description',
        content: 'Get in touch with us.',
      },
      {
        property: 'og:image',
        content: CONFIG.profilePic,
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: `Contact Us | ${CONFIG.title}` },
      { name: 'twitter:description', content: 'Get in touch with us.' },
      { name: 'twitter:image', content: CONFIG.profilePic },
    ],
  }),
})

function ContactUs() {
  return (
    <>
      <Container className="py-16">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
              Contact Us
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Have a question or want to work with us? Fill out the form below.
            </p>
          </div>
          <ContactPage />
        </div>
      </Container>
      {/* <Taskbar /> */}
    </>
  )
}
