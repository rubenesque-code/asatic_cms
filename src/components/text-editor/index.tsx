import { EditorContent, useEditor } from "@tiptap/react";
import { Node } from "@tiptap/core";
import Document from "@tiptap/extension-document";
import StarterKit from "@tiptap/starter-kit";
import Typography from "@tiptap/extension-typography";
import Placeholder from "@tiptap/extension-placeholder";
import tw from "twin.macro";

// todo: Placeholder extension not working
// todo: have an author element
// todo: go over globals.css

const CustomDocument = Document.extend({
  content: "heading block*",
});

const TextEditor = () => {
  const editor = useEditor({
    extensions: [
      CustomDocument,
      StarterKit.configure({ document: false }),
      Typography,
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === "heading") {
            return "What's the title?";
          }

          return "Can you add some further context?";
        },
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg m-auto xl:prose-2xl m-5 focus:outline-none",
      },
    },
    content: `
      <h1>
        Enter title here
      </h1>
      <p>
        Enter article text here
      </p>
    `,
  });

  if (!editor) {
    return null;
  }

  const editorOutput = editor.getHTML();

  return (
    <div css={[tw``]}>
      <EditorContent editor={editor} />
    </div>
  );
};

export default TextEditor;
