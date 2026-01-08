import YooptaEditor, { createYooptaEditor } from '@yoopta/editor'
import Paragraph from '@yoopta/paragraph'
import Blockquote from '@yoopta/blockquote'
import Callout from '@yoopta/callout'
import Code from '@yoopta/code'
import Divider from '@yoopta/divider'
import LinkTool from '@yoopta/link-tool'
import Link from '@yoopta/link'
import { BulletedList, NumberedList, TodoList } from '@yoopta/lists'
import {
  Bold,
  CodeMark,
  Highlight,
  Italic,
  Strike,
  Underline,
} from '@yoopta/marks'
import ActionMenu, { DefaultActionMenuRender } from '@yoopta/action-menu-list'
import Embed from '@yoopta/embed'
import Video from '@yoopta/video'
import Toolbar, { DefaultToolbarRender } from '@yoopta/toolbar'
import { HeadingOne, HeadingThree, HeadingTwo } from '@yoopta/headings'
import { useMemo, useRef } from 'react'
import ImageYoopta from '@yoopta/image'
import { cn } from '@/lib/utils'

const plugins = [
  Paragraph,
  Blockquote,
  NumberedList,
  BulletedList,
  TodoList,
  Callout,
  Code,
  Embed,
  HeadingOne,
  HeadingTwo,
  HeadingThree,
  Divider,
  Video,
  Link,
  ImageYoopta,
]

const TOOLS = {
  Toolbar: {
    tool: Toolbar,
    render: DefaultToolbarRender,
  },
  ActionMenu: {
    tool: ActionMenu,
    render: DefaultActionMenuRender,
  },
  LinkTool: {
    tool: LinkTool,
    render: LinkTool,
  },
}

const MARKS = [Bold, Italic, CodeMark, Underline, Strike, Highlight]

interface BlockEditorProps {
  value?: any
  onChange?: (value: any) => void
  readOnly?: boolean
  className?: string
}

export const useBlockEditor = () => {
  const editor = useMemo(() => createYooptaEditor(), [])
  return editor
}

export function BlockEditor({
  value,
  onChange,
  readOnly = false,
  editor: propEditor,
  className,
}: BlockEditorProps & { editor?: any }) {
  const defaultEditor = useBlockEditor()
  const editor = propEditor || defaultEditor
  const selectionRef = useRef(null)

  return (
    <div
      className={cn(
        'yoopta-editor-container border rounded-md p-4 min-h-[400px] w-full',
        className,
      )}
      ref={selectionRef}
    >
      <YooptaEditor
        editor={editor}
        plugins={plugins}
        tools={TOOLS}
        marks={MARKS}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        selectionBoxRoot={selectionRef}
        placeholder="Start writing your blog..."
        style={{ width: '100%' }}
      />
    </div>
  )
}
