import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import type { UserProfile } from '@/db/schema/profile'
import { CONFIG } from '@/config/config'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

interface HeroSectionProps {
  profile: UserProfile | null
}

export const HeroSection = ({ profile }: HeroSectionProps) => {
  return (
    <section className="relative flex flex-col-reverse items-center justify-center gap-10 overflow-hidden  mt-10 md:flex-row md:gap-20">
      {/* Subtle Background Gradient */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse at 70% 30%, var(--tw-color-primary-muted) 0%, transparent 40%)',
          opacity: 0.2,
        }}
      />

      {/* Ensure content is above the gradient */}
      <div className="absolute  inset-0 z-0 bg-linear-to-b from-background/30 via-background/80 to-background" />

      {/* Text Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="z-10 flex-1 text-center md:text-left"
      >
        {/* Kicker */}
        <motion.p
          variants={itemVariants}
          className="mb-2 text-lg font-medium text-primary md:text-xl"
        >
          Hello, I&apos;m
        </motion.p>

        {/* Name */}
        <motion.h1
          variants={itemVariants}
          className="mb-4 text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl"
        >
          {profile?.name || CONFIG.name}
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="mb-8 max-w-lg text-lg text-muted-foreground md:text-xl"
        >
          {profile?.description || CONFIG.description}
        </motion.p>

        {/* Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-4 md:justify-start"
        >
          {/* Primary Button */}
          <Link
            to="/contact-us"
            className="rounded-lg border bg-primary px-6 py-3 font-medium text-primary-foreground shadow-sm transition-transform hover:scale-105 hover:shadow-md"
          >
            Get in touch
          </Link>
          {/* <a
            href="/dhruvish-cv.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-input bg-transparent px-6 py-3 font-medium shadow-sm transition-transform hover:scale-105 hover:bg-accent hover:text-accent-foreground hover:shadow-md"
          >
            Download CV
          </a> */}
        </motion.div>
      </motion.div>

      {/* Profile Image */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="z-10 shrink-0"
      >
        <div className="relative h-18 w-18 overflow-hidden rounded-full border-2 shadow-xl shadow-primary/20 md:h-40 md:w-40">
          <img
            src={profile?.image || CONFIG.profilePic}
            alt={`Profile picture of ${profile?.name || CONFIG.name}`}
            sizes="(max-width: 768px) 128px, 160px"
            className="object-cover"
          />
        </div>
      </motion.div>
    </section>
  )
}
