import { Editor, EditorContent, useEditor } from "@tiptap/react";
// import Document from "@tiptap/extension-document";
import StarterKit from "@tiptap/starter-kit";
import Typography from "@tiptap/extension-typography";
import Placeholder from "@tiptap/extension-placeholder";
import tw, { css } from "twin.macro";
// import { v4 as generateUId } from "uuid";

import {
  buttonSelectors,
  buttonSelectorTransition,
  iconButtonDefault,
} from "^styles/common";
import { ArrowUUpLeft } from "phosphor-react";
import WithTooltip from "^components/WithTooltip";

// todo: go over globals.css
// todo: change font to tamil font when on tamil translation and vice versa. Will be different instances so can pass in as prop.

// todo: can't see menu which is overflowing
// todo: functionality:

const RichTextEditor = ({
  initialContent,
  // docContent,
  onUpdate,
  placeholder,
}: {
  // docContent: string;
  initialContent: string;
  onUpdate: (output: string) => void;
  placeholder: string | (() => string);
}) => {
  const editor = useEditor({
    extensions: [
      // Document.extend({
      // content: docContent,
      // }),
      // StarterKit.configure({ document: false }),
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
        class:
          "z-50 prose prose-sm sm:prose md:prose-lg font-serif-eng focus:outline-none overflow-y-visible",
      },
    },
    content: initialContent,
  });

  if (!editor) {
    return null;
  }

  return (
    <div
      className="group"
      css={[s_editor.container]}
      onBlur={() => {
        const output = editor.getHTML();
        onUpdate(output);
      }}
      onFocus={() => console.log("hello")}
    >
      <EditorMenu editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

const s_editor = {
  container: tw`relative z-50 overflow-y-visible`,
};

export default RichTextEditor;

// const editorMenuButtons = [
// {
// id: generateUId(),
// icon: <ArrowUUpLeft />,
// },
// ];

const EditorMenu = ({ editor }: { editor: Editor }) => {
  const canUndo = editor.can().undo();
  return (
    <menu css={[s_editorMenu.container]}>
      <WithTooltip text={canUndo ? "undo" : "nothing to undo"}>
        <button
          css={[s_editorMenu.button]}
          onClick={() => editor.chain().focus().undo().run()}
          type="button"
        >
          <ArrowUUpLeft />
        </button>
      </WithTooltip>
    </menu>
  );
};

const s_editorMenu = {
  container: tw`group-focus-within:visible z-50 absolute -top-sm -translate-y-full flex items-center gap-sm bg-white rounded-md shadow-lg`,
  button: {
    button: css`
      ${iconButtonDefault} ${buttonSelectors} ${buttonSelectorTransition}
    `,
    disabled: tw`cursor-auto text-gray-disabled`,
    isActive: tw`bg-gray-500 text-white`,
  },
};
