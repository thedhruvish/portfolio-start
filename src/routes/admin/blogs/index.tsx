import { useState } from 'react'
import { Link, createFileRoute, useRouter } from '@tanstack/react-router'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { deleteBlogFn, getBlogsFn, updateBlogStatusFn } from '@/functions/admin'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export const Route = createFileRoute('/admin/blogs/')({
  loader: async () => {
    const blogs = await getBlogsFn({ data: { page: 1, pageSize: 100 } })
    return { blogs }
  },
  component: BlogsListPage,
})

type Blog = {
  id: number
  title: string
  slug: string
  published: boolean | null
  createdAt: Date | null
  updatedAt: Date | null
}

const columnHelper = createColumnHelper<Blog>()

function BlogsListPage() {
  const { blogs } = Route.useLoaderData()
  const router = useRouter()
  const [globalFilter, setGlobalFilter] = useState('')

  const columns = [
    columnHelper.accessor('title', {
      header: 'Title',
      cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    }),
    columnHelper.accessor('slug', {
      header: 'Slug',
    }),
    columnHelper.accessor('published', {
      header: 'Status',
      cell: (info) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={!!info.getValue()}
            onCheckedChange={async (checked) => {
              try {
                await updateBlogStatusFn({
                  data: {
                    id: info.row.original.id,
                    published: checked,
                  },
                })
                router.invalidate()
                toast.success(
                  `Blog ${checked ? 'published' : 'unpublished'} successfully`,
                )
              } catch (error) {
                toast.error('Failed to update blog status')
              }
            }}
          />
          <span className="text-sm text-muted-foreground">
            {info.getValue()}
          </span>
        </div>
      ),
    }),
    columnHelper.accessor('createdAt', {
      header: 'Created At',
      cell: (info) => {
        const date = info.getValue()
        return date ? date.toLocaleDateString() : '-'
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info) => {
        const blog = info.row.original
        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/admin/blogs/$id" params={{ id: blog.id.toString() }}>
                <Eye className="h-4 w-4" />
                <span className="sr-only">View</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link
                to="/admin/blogs/$id/edit"
                params={{ id: blog.id.toString() }}
              >
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={async () => {
                if (confirm('Are you sure you want to delete this blog?')) {
                  try {
                    await deleteBlogFn({ data: blog.id })
                    toast.success('Blog deleted')
                    router.invalidate()
                  } catch (e) {
                    toast.error('Failed to delete blog')
                  }
                }
              }}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        )
      },
    }),
  ]

  const table = useReactTable({
    data: blogs.data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Blogs</h2>
        <Button asChild>
          <Link to="/admin/blogs/new">
            <Plus className="mr-2 h-4 w-4" /> New Blog
          </Link>
        </Button>
      </div>

      <div className="flex items-center">
        <Input
          placeholder="Filter blogs..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
