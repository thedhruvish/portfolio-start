import { Suspense, lazy } from 'react'

const Editor = lazy(() =>
  import('./index').then((module) => ({ default: module.BlockEditor })),
)

export function BlockEditor(props: React.ComponentProps<typeof Editor>) {
  return (
    <Suspense
      fallback={
        <div className="h-[400px] w-full animate-pulse bg-muted rounded-md" />
      }
    >
      <Editor {...props} />
    </Suspense>
  )
}
