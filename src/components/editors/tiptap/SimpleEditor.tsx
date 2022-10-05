import { Editor, EditorContent, JSONContent, useEditor } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import StarterKit from "@tiptap/starter-kit";
import TipTapLink from "@tiptap/extension-link";
import { createTextDoc } from "^helpers/tiptap";

const SimpleTipTapEditor = ({
  initialContent,
  onUpdate,
  placeholder = "write here",
  lineClamp,
  styles = "",
  useProse = true,
  useDarkPlaceholder = false,
}: {
  initialContent: JSONContent | undefined;
  onUpdate: (output: JSONContent) => void;
  placeholder?: string;
  lineClamp?: string;
  styles?: string;
  useProse?: boolean;
  useDarkPlaceholder?: boolean;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Typography,
      Placeholder.configure({
        showOnlyWhenEditable: false,
        showOnlyCurrent: false,
        placeholder,
        emptyEditorClass: useDarkPlaceholder ? "tip-tap-placeholder-dark" : "",
      }),
      TipTapLink.configure({
        openOnClick: false,
        linkOnPaste: false,
      }),
    ],
    editorProps: {
      attributes: {
        class: `${
          useProse && "prose prose-lg prose-p:leading-7"
        } w-full font-serif-eng focus:outline-none ${styles} ${
          lineClamp && lineClamp
        }`,
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
      onPasteCapture={(e) => {
        e.preventDefault();

        const clipboardText = e.clipboardData.getData("text/plain");

        editor.commands.setContent(createTextDoc(clipboardText));
      }}
    />
  );
};
