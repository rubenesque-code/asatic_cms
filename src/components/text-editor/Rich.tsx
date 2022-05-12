import { Editor, EditorContent, useEditor } from "@tiptap/react";
// import Document from "@tiptap/extension-document";
import StarterKit from "@tiptap/starter-kit";
import Typography from "@tiptap/extension-typography";
import Placeholder from "@tiptap/extension-placeholder";
import TipTapLink from "@tiptap/extension-link";
import tw, { css } from "twin.macro";
// import { v4 as generateUId } from "uuid";

import {
  buttonSelectors,
  buttonSelectorTransition,
  iconButtonDefault,
} from "^styles/common";
import {
  ArrowUUpLeft,
  ArrowUUpRight,
  Link,
  ListBullets,
  ListNumbers,
  Quotes,
  TextBolder,
  TextItalic,
} from "phosphor-react";
import WithTooltip from "^components/WithTooltip";
import { cloneElement, FormEvent, ReactElement, useState } from "react";
import WithProximityPopover from "^components/WithProximityPopover";

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
      TipTapLink.configure({
        openOnClick: false,
        linkOnPaste: false,
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
      className="group"
      css={[s_editor.container]}
      onBlur={() => {
        const output = editor.getHTML();
        onUpdate(output);
      }}
    >
      <Menu editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

const s_editor = {
  container: tw`relative`,
};

export default RichTextEditor;

// const editorMenuButtons = [
// {
// id: generateUId(),
// icon: <ArrowUUpLeft />,
// },
// ];

const Menu = ({ editor }: { editor: Editor }) => {
  const canUndo = editor.can().undo();
  const canRedo = editor.can().redo();
  const isSelectedText = !editor.view.state.selection.empty;

  return (
    <menu css={[s_menu.container]}>
      <MenuButton
        icon={<ArrowUUpLeft />}
        onClick={() => editor.chain().focus().undo().run()}
        tooltipText={canUndo ? "undo" : "nothing to undo"}
        isDisabled={!canUndo}
      />
      <MenuButton
        icon={<ArrowUUpRight />}
        onClick={() => editor.chain().focus().redo().run()}
        tooltipText={canRedo ? "redo" : "nothing to redo"}
        isDisabled={!canRedo}
      />
      <MenuButton
        icon={<TextBolder />}
        onClick={() => editor.chain().focus().toggleBold().run()}
        tooltipText="bold"
        isActive={editor.isActive("bold")}
      />
      <MenuButton
        icon={<TextItalic />}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        tooltipText="italic"
        isActive={editor.isActive("italic")}
      />
      <MenuButton
        icon={<ListBullets />}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        tooltipText="bullet list"
        isActive={editor.isActive("bulletList")}
      />
      <MenuButton
        icon={<ListNumbers />}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        tooltipText="ordered list"
        isActive={editor.isActive("orderedList")}
      />
      <LinkPopover
        buttonProps={{ canLink: isSelectedText }}
        panelProps={{
          initialValue: editor.getAttributes("link").href,
          setLink: (link: string) =>
            editor
              .chain()
              .focus()
              .extendMarkRange("link")
              .setLink({ href: link, target: "_blank" })
              .run(),
          unsetLink: () =>
            editor.chain().focus().extendMarkRange("link").unsetLink().run(),
        }}
      />
      <MenuButton
        icon={<Quotes />}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        tooltipText="quote"
        isActive={editor.isActive("blockquote")}
      />
    </menu>
  );
};

const s_menu = {
  container: tw`z-20 invisible opacity-0 group-focus-within:visible group-focus-within:opacity-100 -translate-y-full absolute -top-sm min-w-full px-sm py-xs flex items-center gap-xs bg-white rounded-md border-2 border-black transition-opacity ease-in-out duration-150`,
};

const MenuButton = ({
  icon,
  onClick,
  tooltipText,
  isActive,
  isDisabled,
}: {
  icon: ReactElement;
  onClick?: () => void;
  tooltipText: string;
  isActive?: boolean;
  isDisabled?: boolean;
}) => {
  return (
    <WithTooltip text={tooltipText}>
      <button
        css={[
          s_button.button,
          isDisabled && s_button.disabled,
          isActive && s_button.isActive,
        ]}
        onClick={onClick}
        type="button"
      >
        {cloneElement(icon, { weight: "bold" })}
      </button>
    </WithTooltip>
  );
};

const s_button = {
  button: css`
    ${iconButtonDefault} ${buttonSelectors} ${buttonSelectorTransition}
    ${tw`text-base p-xxs`}
  `,
  disabled: tw`cursor-auto text-gray-disabled`,
  isActive: tw`bg-gray-400 text-white`,
};

type LinkButtonProps = {
  canLink: boolean;
};

type LinkPanelProps = {
  initialValue: string | undefined;
  setLink: (link: string) => void;
  unsetLink: () => void;
};

const LinkPopover = ({
  buttonProps,
  panelProps,
}: {
  buttonProps: LinkButtonProps;
  panelProps: LinkPanelProps;
}) => {
  return (
    <WithProximityPopover
      disabled={!buttonProps.canLink}
      panelContentElement={({ close: closePanel }) => (
        <LinkPanel closePanel={closePanel} {...panelProps} />
      )}
    >
      <LinkButton {...buttonProps} />
    </WithProximityPopover>
  );
};

const LinkButton = ({ canLink }: LinkButtonProps) => {
  return (
    <MenuButton
      icon={<Link />}
      tooltipText={canLink ? "set link" : "select text before setting link"}
      isDisabled={!canLink}
    />
  );
};

const LinkPanel = ({
  closePanel,
  setLink,
  unsetLink,
  initialValue,
}: { closePanel: () => void } & LinkPanelProps) => {
  const [value, setValue] = useState(initialValue || "");

  console.log(initialValue);
  const selectedTextHasLink = initialValue?.length;

  const handleEditLink = () => {
    const isInputtedValue = value.length;

    if (isInputtedValue) {
      setLink(value);
    } else {
      unsetLink();
    }

    closePanel();
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    handleEditLink();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div css={[s_linkPanel.input.container]}>
        <input
          css={[
            s_linkPanel.input.input,
            s_linkPanel.input.unfocused,
            s_linkPanel.input.focused,
          ]}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter link here"
          type="text"
        />
      </div>
      <div css={[s_linkPanel.buttons.container]}>
        {selectedTextHasLink ? (
          <button
            css={[
              s_linkPanel.buttons.button,
              tw`border-gray-600 text-gray-700`,
            ]}
            onClick={unsetLink}
            type="button"
          >
            Remove link
          </button>
        ) : null}
        <button
          css={[s_linkPanel.buttons.button, tw`border-gray-600 text-gray-700`]}
          onClick={() => {
            handleEditLink();
          }}
          type="button"
        >
          Set link
        </button>
      </div>
    </form>
  );
};

const s_linkPanel = {
  input: {
    container: tw`px-lg py-lg`,
    input: tw`outline-none border rounded-sm transition-all ease-in duration-75`,
    focused: tw`focus:outline-none focus:border-gray-500 focus:px-3 focus:py-2`,
    unfocused: tw`p-0 border-transparent`,
  },
  buttons: {
    container: tw`flex justify-between items-center px-lg py-sm bg-gray-50 rounded-md`,
    button: tw`py-1 px-2 border-2 uppercase tracking-wide text-xs rounded-sm font-medium hover:bg-gray-100 bg-gray-50 transition-colors ease-in-out duration-75`,
  },
};
