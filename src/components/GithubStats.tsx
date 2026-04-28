import { useQuery } from '@tanstack/react-query'
import { GitFork, Star, Users, BookOpen, Loader2 } from 'lucide-react'
import { getGithubStatsFn } from '@/functions/github'
import { Card, CardContent } from './ui/card'
import { motion } from 'framer-motion'

export function GithubStats() {
  const {
    data: stats,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['github-stats'],
    queryFn: () => getGithubStatsFn(),
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-muted/30 animate-pulse border-none">
            <CardContent className="p-6 h-24" />
          </Card>
        ))}
      </div>
    )
  }

  if (isError || !stats) return null

  const statItems = [
    {
      label: 'Total Stars',
      value: stats.totalStars,
      icon: Star,
      color: 'text-yellow-500',
    },
    {
      label: 'Repositories',
      value: stats.publicRepos,
      icon: BookOpen,
      color: 'text-green-500',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto">
      {statItems.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="bg-muted/30 border-border/50 hover:bg-muted/50 transition-colors">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
              <item.icon className={`w-5 h-5 ${item.color}`} />
              <div className="space-y-1">
                <p className="text-2xl font-bold">
                  {item.value.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  {item.label}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
