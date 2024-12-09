import React from 'react'
import { Editor } from '@tiptap/react'
import { Button } from "@/components/ui/button"
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered } from 'lucide-react'

interface ToolbarMenuProps {
  editor: Editor | null
}

/**
 * Renders a toolbar menu with formatting options for a rich text editor.
 * @param {Object} props - The component props.
 * @param {Object} props.editor - The editor instance to manipulate text formatting.
 * @returns {React.ReactElement|null} A div containing formatting buttons or null if no editor is provided.
 */
const ToolbarMenu: React.FC<ToolbarMenuProps> = ({ editor }) => {
  if (!editor) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
        size="icon"
        variant="outline"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
        size="icon"
        variant="outline"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        className={editor.isActive('underline') ? 'is-active' : ''}
        size="icon"
        variant="outline"
      >
        <Underline className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}
        size="icon"
        variant="outline"
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}
        size="icon"
        variant="outline"
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}
        size="icon"
        variant="outline"
      >
        <AlignRight className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'is-active' : ''}
        size="icon"
        variant="outline"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'is-active' : ''}
        size="icon"
        variant="outline"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default ToolbarMenu

