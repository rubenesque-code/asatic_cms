import { EditorContent, useEditor } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import StarterKit from "@tiptap/starter-kit";
import Typography from "@tiptap/extension-typography";
import Placeholder from "@tiptap/extension-placeholder";

const CustomDocument = Document.extend({
  content: "heading",
});

const placeholderText = "Enter title here";

const TitleTextEditor = () => {
  const editor = useEditor({
    extensions: [
      CustomDocument,
      StarterKit.configure({ document: false }),
      Typography,
      Placeholder.configure({
        showOnlyWhenEditable: false,
        showOnlyCurrent: false,
        placeholder: () => {
          return placeholderText;
        },
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose md:prose-lg m-auto font-serif-eng focus:outline-none",
      },
    },
    content: `
      <h1>
        ${placeholderText}
      </h1>
    `,
  });

  if (!editor) {
    return null;
  }

  return <EditorContent editor={editor} />;
};

export default TitleTextEditor;
