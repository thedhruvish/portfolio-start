import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { getContactsFn } from '@/functions/contact'

const contactSearchSchema = z.object({
  search: z.string().optional(),
})

export const Route = createFileRoute('/admin/contacts/')({
  validateSearch: (search) => contactSearchSchema.parse(search),
  loaderDeps: ({ search: { search } }) => ({ search }),
  loader: async ({ deps: { search } }) =>
    await getContactsFn({ data: { search } }),
  component: AdminContactsPage,
})

function AdminContactsPage() {
  const contacts = Route.useLoaderData()
  const { search } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Contact Submissions
        </h2>
        <Input
          placeholder="Search by name or email..."
          value={search || ''}
          onChange={(e) => {
            navigate({
              search: { search: e.target.value || undefined },
              replace: true,
            })
          }}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="w-[400px]">Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No submissions found.
                </TableCell>
              </TableRow>
            ) : (
              contacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>{contact.id}</TableCell>
                  <TableCell>
                    {contact.firstName} {contact.lastName}
                  </TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.phoneNumber}</TableCell>
                  <TableCell className="max-w-[400px] wrap-break-word">
                    {contact.message}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
