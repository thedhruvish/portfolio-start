import { createServerFn } from '@tanstack/react-start'
import { CONFIG } from '@/config/config'

export const getGithubStatsFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const username = CONFIG.SOCIAL_MEDIA.githubUsername
    
    try {
      const [userResponse, reposResponse] = await Promise.all([
        fetch(`https://api.github.com/users/${username}`, {
          headers: {
            'User-Agent': 'portfolio-app',
          },
        }),
        fetch(`https://api.github.com/users/${username}/repos?per_page=100`, {
          headers: {
            'User-Agent': 'portfolio-app',
          },
        }),
      ])

      if (!userResponse.ok || !reposResponse.ok) {
        throw new Error('Failed to fetch GitHub data')
      }

      const userData = await userResponse.json()
      const reposData = await reposResponse.json()

      // Calculate total stars
      const totalStars = reposData.reduce(
        (acc: number, repo: any) => acc + repo.stargazers_count,
        0,
      )

      return {
        followers: userData.followers,
        following: userData.following,
        publicRepos: userData.public_repos,
        totalStars,
        avatarUrl: userData.avatar_url,
        bio: userData.bio,
      }
    } catch (error) {
      console.error('GitHub API error:', error)
      return null
    }
  },
)
