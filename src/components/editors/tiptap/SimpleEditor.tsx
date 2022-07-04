import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import { Editor, EditorContent, JSONContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const SimpleTipTapEditor = ({
  initialContent,
  onUpdate,
  placeholder = "write here",
}: {
  initialContent: JSONContent | undefined;
  onUpdate: (output: JSONContent) => void;
  placeholder?: string;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Typography,
      Placeholder.configure({
        showOnlyWhenEditable: false,
        showOnlyCurrent: false,
        placeholder,
      }),
    ],
    editorProps: {
      attributes: {
        class: "prose w-full font-serif-eng focus:outline-none",
      },
    },
    content: initialContent,
  });

  if (!editor) {
    return null;
  }

  return <Initialised editor={editor} onUpdate={onUpdate} />;
};

export default SimpleTipTapEditor;

const Initialised = ({
  editor,
  onUpdate,
}: {
  editor: Editor;
  onUpdate: (output: JSONContent) => void;
}) => {
  return (
    <EditorContent
      editor={editor}
      onBlur={() => {
        const output = editor.getJSON();
        onUpdate(output);
      }}
    />
  );
};
