import { createFileRoute, useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Plus, Trash2 } from 'lucide-react'
import dayjs from 'dayjs'
import { useState } from 'react'
import {
  deleteSubscriberFn,
  getSubscribersFn,
  subscribeToNewsletterFn,
  toggleSubscriberStatusFn,
} from '@/functions/subscribers'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export const Route = createFileRoute('/admin/subscribers')({
  loader: async () => {
    const subscribers = await getSubscribersFn()
    return { subscribers }
  },
  component: AdminSubscribers,
})

function AdminSubscribers() {
  const { subscribers } = Route.useLoaderData()
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleToggle = async (id: number, active: boolean) => {
    try {
      await toggleSubscriberStatusFn({ data: { id, active } })
      toast.success(active ? 'Subscriber activated' : 'Subscriber disabled')
      router.invalidate()
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this subscriber?')) return
    try {
      await deleteSubscriberFn({ data: id })
      toast.success('Subscriber deleted')
      router.invalidate()
    } catch (error) {
      toast.error('Failed to delete subscriber')
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEmail) return
    setIsSubmitting(true)
    try {
      const res = await subscribeToNewsletterFn({ data: { email: newEmail } })
      if (res.success) {
        toast.success(res.message)
        setNewEmail('')
        setIsDialogOpen(false)
        router.invalidate()
      } else {
        toast.error(res.message || 'Failed to add subscriber')
      }
    } catch (error) {
      // Zod error or server error
      toast.error('Failed to add subscriber. Check email format.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Subscribers</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Subscriber
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Newsletter Subscribers ({subscribers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Joined Date</TableHead>
                <TableHead>Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscribers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No subscribers found.
                  </TableCell>
                </TableRow>
              ) : (
                subscribers.map((subscriber) => (
                  <TableRow key={subscriber.id}>
                    <TableCell className="font-medium">
                      {subscriber.email}
                    </TableCell>
                    <TableCell>
                      {dayjs(subscriber.createdAt).format('MMM D, YYYY h:mm A')}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={subscriber.active ?? true}
                        onCheckedChange={(checked) =>
                          handleToggle(subscriber.id, checked)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(subscriber.id)}
                        className="text-muted-foreground hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Subscriber</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4 pt-4">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Adding...' : 'Add Subscriber'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
