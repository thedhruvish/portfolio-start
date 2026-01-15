import ExpoApp from '@/components/svgs/technologies/ExpoApp'
import ExpressJs from '@/components/svgs/technologies/ExpressJs'
import MongoDB from '@/components/svgs/technologies/MongoDB'
import NodeJs from '@/components/svgs/technologies/NodeJs'
import ReactIcon from '@/components/svgs/technologies/ReactIcon'
import TypeScript from '@/components/svgs/technologies/TypeScript'

export type Tech = {
  name: string
  icon: React.ComponentType
}

export const techIcons: Record<string, React.ComponentType | undefined> = {
  React: ReactIcon,
  Nodejs: NodeJs,
  Expressjs: ExpressJs,
  MongoDB: MongoDB,
  Expo: ExpoApp,
  Typescript: TypeScript,
}

export type Project = {
  title: string
  description: string
  image?: string
  github?: string
  link?: string
  tech?: Array<Tech>
}

export const projectList: Array<Project> = [
  {
    title: 'Storage Web App',
    image: 'https://assets.aceternity.com/templates/Foxtrot.png',
    description:
      'A modern, full-stack web application for secure file storage, sharing, and management with a Google Drive-like interface.',
    github: 'https://github.com/thedhruvish/storage-web-app',
    tech: [
      {
        name: 'React',
        icon: ReactIcon,
      },
      {
        name: 'Nodejs',
        icon: NodeJs,
      },
      {
        name: 'Expressjs',
        icon: ExpressJs,
      },
      {
        name: 'MongoDB',
        icon: MongoDB,
      },
    ],
  },
  {
    title: 'YOUcs',
    image: 'https://assets.aceternity.com/templates/Foxtrot.png',
    description:
      'Master any conversation. YOUcs provides AI-driven practice and instant feedback to boost your speaking confidence.',
    link: 'https://YOUcs.dhruvish.in',
    tech: [
      {
        name: 'React',
        icon: ReactIcon,
      },
      {
        name: 'Nodejs',
        icon: NodeJs,
      },
      {
        name: 'Expo',
        icon: ExpoApp,
      },
    ],
  },
  {
    title: 'Do Not Code',
    image: 'https://assets.aceternity.com/templates/Foxtrot.png',
    description: 'Your productivity partner for meaningful breaks.',
    link: 'https://do-not-code.dhruvish.in/',
    tech: [
      {
        name: 'Typescript',
        icon: TypeScript,
      },
    ],
  },
]
