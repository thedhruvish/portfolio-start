import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import appCss from '../styles.css?url'
import { ThemeProvider } from '@/provider/theme-provider'
import { Toaster } from '@/components/ui/sonner'

dayjs.extend(relativeTime)

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
  notFoundComponent: () => <p>Not Found</p>,
})

const queryClient = new QueryClient()

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="dhruvish-theme">
        <html lang="en">
          <head>
            <HeadContent />
            <script
              dangerouslySetInnerHTML={{
                __html: `(function(){var storageKey='dhruvish-theme';var defaultTheme='system';var theme=localStorage.getItem(storageKey) || defaultTheme;var root=document.documentElement;root.classList.remove('light', 'dark');if(theme==='system'){var systemTheme=window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark':'light';root.classList.add(systemTheme); }else{root.classList.add(theme);}})();`,
              }}
            />
          </head>
          <body>
            {children}
            <TanStackDevtools
              config={{
                position: 'bottom-right',
              }}
              plugins={[
                {
                  name: 'Tanstack Router',
                  render: <TanStackRouterDevtoolsPanel />,
                },
              ]}
            />
            <Toaster />
            <Scripts />
          </body>
        </html>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
