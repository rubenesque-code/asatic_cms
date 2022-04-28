import { EditorContent, useEditor } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import StarterKit from "@tiptap/starter-kit";
import Typography from "@tiptap/extension-typography";
import Placeholder from "@tiptap/extension-placeholder";

// todo: Placeholder extension not working
// todo: have an author element
// todo: go over globals.css
// todo: change font to tamil font when on tamil translation and vice versa

const CustomDocument = Document.extend({
  content: "block*",
});

const ArticleBodyTextEditor = () => {
  const editor = useEditor({
    extensions: [
      CustomDocument,
      StarterKit.configure({ document: false }),
      Typography,
      Placeholder.configure({
        showOnlyWhenEditable: false,
        showOnlyCurrent: false,
        placeholder: () => {
          return "Enter article body here";
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
      <p>
        Enter article text here
      </p>
    `,
  });

  if (!editor) {
    return null;
  }

  return <EditorContent editor={editor} />;
};

export default ArticleBodyTextEditor;
