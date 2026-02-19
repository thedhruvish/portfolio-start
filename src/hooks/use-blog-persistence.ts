import { useEffect } from 'react'

export function useBlogPersistence(key: string, form: any) {
  useEffect(() => {
    // Restore data on mount
    const savedData = localStorage.getItem(key)
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        // Only restore if we have valid data and form is pristine-ish
        // For new blogs, always restore. For edits, we might want to be careful
        // but for now, we'll restore if key matches.
        // We use a timeout to ensure form is ready
        setTimeout(() => {
          Object.entries(parsed).forEach(([field, value]) => {
            if (value !== undefined && value !== null) {
              form.setFieldValue(field, value)
            }
          })
        }, 0)
      } catch (e) {
        console.error('Failed to parse saved blog data', e)
      }
    }
  }, [key]) // Run once on mount per key

  useEffect(() => {
    // Save data on change
    // Using a simple debounce via timeout could be better performance-wise
    // but for now relying on effect dependency might be okay if form state updates aren't too rapid
    // Tanstack form state subscription would be ideal, but here we can just listen to form.state.values
    const timeoutId = setTimeout(() => {
      localStorage.setItem(key, JSON.stringify(form.state.values))
    }, 1000) // Debounce 1s

    return () => clearTimeout(timeoutId)
  }, [form.state.values, key])

  const clearCache = () => {
    localStorage.removeItem(key)
  }

  return { clearCache }
}
