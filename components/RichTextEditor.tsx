/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/RichTextEditor.tsx

"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import {
  Bold,
  Columns,
  Italic,
  List,
  ListOrdered,
  Minus,
  Rows,
  TableIcon,
  Trash2,
  Underline as UnderlineIcon,
} from "lucide-react";

// We import the Toggle component we just created manually
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

// --- Toolbar Component ---
const Toolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="border border-input bg-transparent rounded-t-md p-1 flex flex-wrap items-center gap-1">
      {/* Bold, Italic, Underline */}
      <Toggle
        size="sm"
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
        aria-label="Toggle bold"
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        aria-label="Toggle italic"
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("underline")}
        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
        aria-label="Toggle underline"
      >
        <UnderlineIcon className="h-4 w-4" />
      </Toggle>

      {/* <Separator orientation="vertical" className="h-8 mx-1" /> */}

      {/* Lists */}
      <Toggle
        size="sm"
        pressed={editor.isActive("bulletList")}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
        aria-label="Toggle bullet list"
      >
        <List className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("orderedList")}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
        aria-label="Toggle ordered list"
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>

      {/* <Separator orientation="vertical" className="h-8 mx-1" /> */}

      {/* Insertions */}
      {/* <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        aria-label="Insert horizontal rule"
      >
        <Minus className="h-4 w-4" />
      </Button> */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() =>
          editor
            .chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run()
        }
        aria-label="Insert table"
      >
        <TableIcon className="h-4 w-4" />
      </Button>

      {/* Table Controls */}
      {editor.isActive("table") && (
        <>
          {/* <Separator orientation="vertical" className="h-8 mx-1" /> */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().addColumnAfter().run()}
            >
              <Columns className="h-4 w-4" aria-label="Add Column After" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().addRowAfter().run()}
            >
              <Rows className="h-4 w-4" aria-label="Add Row After" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().deleteColumn().run()}
            >
              <Columns
                className="h-4 w-4 text-red-500"
                aria-label="Delete Column"
              />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().deleteRow().run()}
            >
              <Rows className="h-4 w-4 text-red-500" aria-label="Delete Row" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().deleteTable().run()}
            >
              <Trash2
                className="h-4 w-4 text-red-500"
                aria-label="Delete Table"
              />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

// --- Main Editor Component ---
interface RichTextEditorProps {
  value: string;
  onChange: (richText: string) => void;
  placeholder?: string;
}

export const RichTextEditor = ({
  value,
  onChange,
  placeholder,
}: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Enable extensions we need
        bulletList: {
          HTMLAttributes: { class: "list-disc pl-4" },
        },
        orderedList: {
          HTMLAttributes: { class: "list-decimal pl-4" },
        },
        // Disable extensions we don't need to keep it light
        code: false,
        codeBlock: false,
        blockquote: false,
        heading: false,
      }),
      Underline,
      // Add table extensions
      Table.configure({
        resizable: true, // Allows column resizing
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value,
    onUpdate({ editor }) {
      // On every change, update the parent component's state
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[150px] w-full bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 prose prose-sm sm:prose-base max-w-none [&_p]:my-2",
      },
    },
  });

  return (
    <div className="flex flex-col mt-1">
      <Toolbar editor={editor} />
      <div className="rounded-b-md border-b border-x border-input overflow-auto max-h-[200px] min-h-0">
        <EditorContent editor={editor} placeholder={placeholder} />
      </div>
    </div>
  );
};
