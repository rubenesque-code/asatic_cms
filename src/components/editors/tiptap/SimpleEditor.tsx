import { Editor, EditorContent, JSONContent, useEditor } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
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
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: "line-clamp-4",
          },
        },
      }),
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
          "prose prose-lg w-full font-serif-eng focus:outline-none prose-p:leading-6",
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
