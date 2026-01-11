# Project Context: dhruvish.in

## Overview

A personal website/portfolio project built with modern React stack, designed for high performance and excellent developer experience.

## Tech Stack

- **Framework**: [Vite](https://vitejs.dev/) with [TanStack Start](https://tanstack.com/start) (Server-Side Rendering)
- **Routing**: [@tanstack/react-router](https://tanstack.com/router) (File-based routing)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) and [shadcn/ui](https://ui.shadcn.com/)
- **Database**: PostgreSQL (e.g., NeonDB) accessed via [Drizzle ORM](https://orm.drizzle.team/)
- **Deployment**: Cloudflare Workers (via Wrangler)

## Key Configuration

- **Vite**: Configured with `@cloudflare/vite-plugin` for SSR on Cloudflare Workers.
- **Drizzle**: Configuration in `drizzle.config.ts` pointing to `src/db/schema/index.ts`.
- **Scripts**:
  - `dev`: `vite dev --port 3000`
  - `build`: `vite build`

## Database Schema (`src/db/schema`)

The database schema includes the following tables:

### 1. Profile (`profile`)

Stores user profile information.

- **Fields**: `name`, `headline`, `description`, `image`, `resumeLink`, `twitter`, `github`, `linkedin`, `email`.

### 2. Projects (`projects`)

Stores portfolio projects.

- **Fields**: `title`, `description`, `image`, `github`, `link`.
- **Tech Stack**: Stored in `tech` column as JSONB (`Array<{ name: string; icon: string }>`).

### 3. Blogs (`blogs`)

Stores blog posts.

- **Fields**: `title`, `slug`, `description`, `content` (JSONB for Yoopta Editor), `thumbImage`.
- **Status**: `published` (boolean), `order` (integer).
- **Timestamps**: `created_at`, `updated_at`.

### 4. Tags (`tags`)

Tags associated with blog posts.

- **Fields**: `tag` (string), `blogId` (Foreign Key to `blogs.id`).

## Project File Structure

- `src/routes`: Contains the file-based route definitions (TanStack Router).
- `src/components`: Reusable UI components.
- `src/db`: Database connection and schema definitions.
- `src/lib` & `src/utils`: Utility functions and shared helpers.
- `public`: Static assets.
