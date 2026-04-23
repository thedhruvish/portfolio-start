import {
  boolean,
  customType,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'

const tsvector = customType<{ data: string }>({
  dataType() {
    return 'tsvector'
  },
})

export const blogs = pgTable(
  'blogs',
  {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    slug: text('slug').notNull().unique(),
    description: text('description'),
    content: jsonb('content'), // JSON content for Yoopta Editor
    thumbImage: text('thumb_image'),
    published: boolean('published').default(false),
    likes: integer('likes').default(0),
    order: integer('order').default(0),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    searchVector: tsvector('search_vector'),
  },
  (table) => ({
    publishedIdx: index('blogs_published_idx').on(table.published),
    createdAtIdx: index('blogs_created_at_idx').on(table.createdAt),
    searchVectorIdx: index('blogs_search_vector_idx').on(table.searchVector),
  }),
)

export type Blog = typeof blogs.$inferSelect
