import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Pencil, Plus, Trash2, Globe, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  getProjectsFn,
  deleteProjectFn,
  updateProjectFn,
} from '@/functions/admin'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/admin/projects')({
  loader: async () => {
    const projects = await getProjectsFn()
    return { projects }
  },
  component: AdminProjects,
})

function AdminProjects() {
  const { projects } = Route.useLoaderData()
  const router = useRouter()

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return
    try {
      await deleteProjectFn({ data: id })
      toast.success('Project deleted')
      router.invalidate()
    } catch (error) {
      toast.error('Failed to delete project')
    }
  }

  const togglePublished = async (project: any) => {
    try {
      await updateProjectFn({ 
        data: { 
          ...project, 
          isPublished: !project.isPublished 
        } 
      })
      toast.success(project.isPublished ? 'Project unpublished' : 'Project published')
      router.invalidate()
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
        <Button asChild>
          <Link to="/admin/projects/new">
            <Plus className="mr-2 h-4 w-4" /> Add Project
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="flex flex-col relative group">
            <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <Badge variant={project.isPublished ? "default" : "secondary"} className="gap-1">
                {project.isPublished ? <Globe className="size-3" /> : <Lock className="size-3" />}
                {project.isPublished ? "Published" : "Draft"}
              </Badge>
            </div>
            
            {project.image && (
              <div className="aspect-video w-full overflow-hidden rounded-t-xl border-b">
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <CardHeader>
              <CardTitle className="line-clamp-1">{project.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {project.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto pt-0 flex justify-between items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => togglePublished(project)}
                className="text-xs"
              >
                {project.isPublished ? 'Unpublish' : 'Publish'}
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  asChild
                >
                  <Link to={`/admin/projects/${project.id}`}>
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(project.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
