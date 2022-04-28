import { EditorContent, useEditor } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import StarterKit from "@tiptap/starter-kit";
import Typography from "@tiptap/extension-typography";
import Placeholder from "@tiptap/extension-placeholder";

// todo: Placeholder extension not working
// todo: have an author element
// todo: go over globals.css
// todo: change font to tamil font when on tamil translation and vice versa

const RichTextEditor = ({
  initialContent,
  docContent,
  onUpdate,
  placeholder,
}: {
  docContent: string;
  initialContent: string;
  onUpdate: (output: string) => void;
  placeholder: () => string;
}) => {
  const editor = useEditor({
    extensions: [
      Document.extend({
        content: docContent,
      }),
      StarterKit.configure({ document: false }),
      Typography,
      Placeholder.configure({
        showOnlyWhenEditable: false,
        showOnlyCurrent: false,
        placeholder,
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose md:prose-lg font-serif-eng focus:outline-none",
      },
    },
    content: initialContent,
  });

  if (!editor) {
    return null;
  }

  return (
    <div
      onBlur={() => {
        const output = editor.getHTML();
        onUpdate(output);
      }}
    >
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
