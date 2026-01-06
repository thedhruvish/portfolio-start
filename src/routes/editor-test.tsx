import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { html } from '@yoopta/exports'
import { BlockEditor, useBlockEditor } from '../components/block-editor'

export const Route = createFileRoute('/editor-test')({
  component: EditorTest,
})

function EditorTest() {
  const [value, setValue] = useState<any>(undefined)
  const [previewHtml, setPreviewHtml] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const editor = useBlockEditor()

  const handleChange = (newValue: any) => {
    setValue(newValue)
    console.log('Editor value:', newValue)
  }

  const handleExport = () => {
    const htmlContent = html.serialize(editor, value)
    console.log('Exported HTML:', htmlContent)
  }

  const handlePreview = () => {
    const htmlContent = html.serialize(editor, value)
    setPreviewHtml(htmlContent)
    setShowPreview(!showPreview)
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Yoopta Editor Test</h1>
      <BlockEditor editor={editor} value={value} onChange={handleChange} />

      <div className="mt-8 p-4 bg-gray-100 rounded-md">
        <h3 className="text-lg font-semibold mb-2">Current Value (JSON):</h3>
        <pre className="text-xs overflow-auto max-h-60">
          {JSON.stringify(value, null, 2)}
        </pre>
      </div>

      <button
        onClick={handleExport}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mr-4"
      >
        Export HTML
      </button>

      <button
        onClick={handlePreview}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
      >
        {showPreview ? 'Hide Preview' : 'Preview'}
      </button>

      {showPreview && previewHtml && (
        <div className="mt-8 prose">
          <h3 className="text-lg font-semibold mb-2">Preview:</h3>
          <div
            className="prose max-w-none p-4 border rounded-md shadow-sm min-h-[200px]"
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        </div>
      )}
    </div>
  )
}
