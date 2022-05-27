import {
  cloneElement,
  FormEvent,
  ReactElement,
  useEffect,
  useState,
} from "react";
import {
  Editor,
  EditorContent,
  useEditor,
  isTextSelection,
  JSONContent,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Typography from "@tiptap/extension-typography";
import Placeholder from "@tiptap/extension-placeholder";
import TipTapLink from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import tw, { css } from "twin.macro";
import {
  ArrowUUpLeft,
  ArrowUUpRight,
  Link,
  ListBullets,
  ListNumbers,
  Quotes,
  TextBolder,
  TextItalic,
  Image as ImageIcon,
  Trash,
} from "phosphor-react";

import WithTooltip from "^components/WithTooltip";
import WithProximityPopover from "^components/WithProximityPopover";
import WithAddImage from "^components/WithAddImage";
import BubbleMenuShell from "^components/text-editor/BubbleMenu";
import WithWarning from "^components/WithWarning";

import usePrevious from "^hooks/usePrevious";
import { arrayDivergence } from "^helpers/general";
import { s_editorMenu } from "^styles/menus";

// todo: go over globals.css
// todo: change font to tamil font when on tamil translation and vice versa. Will be different instances so can pass in as prop.

// todo: image caption. Need to be done so tailwind 'prose' understands it as such.

// todo: menu should be fixed; scrolling should occur within the article body. Maybe use headless ui popover with usepopper to make sticky and have submenus positioned properly too

// todo: border/outline on hocus

// todo: handle image not there
// todo: delete image button caused error but not delete button
// todo: image sizing on add
// todo: if first line is a quote, extra padding is added. If poss, get rid of padding on first node

// todo: is bug on useTrackOutput where image relation isn't updated when image is changed rather than added

// * IMAGES
// * can maybe just use native <img /> tag in CMS; convert to NextImage in frontend

// * ** do storage tokens persist between sessions? From local development, they seem to; (restarted emulators, persisted next day)

type OnUpdate = {
  onUpdate: (output: JSONContent) => void;
};

type TrackEditorOutputPassedProps = {
  onAddImageNode: (imageId: string) => void;
  onRemoveImageNode: (imageId: string) => void;
};

const RichTextEditor = ({
  initialContent,
  placeholder,
  ...passedProps
}: {
  initialContent: JSONContent | undefined;
  placeholder: string | (() => string);
} & OnUpdate &
  TrackEditorOutputPassedProps) => {
  const editor = useEditor({
    extensions: [
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
      Image,
    ],
    editorProps: {
      attributes: {
        class: "prose prose-lg font-serif-eng pb-lg focus:outline-none",
      },
    },
    content: initialContent,
  });

  if (!editor) {
    return null;
  }

  return <EditorInitialised editor={editor} {...passedProps} />;
};

export default RichTextEditor;

const EditorInitialised = ({
  editor,
  onUpdate,
  onAddImageNode,
  onRemoveImageNode,
}: { editor: Editor } & OnUpdate & TrackEditorOutputPassedProps) => {
  useTrackEditorOutput({
    content: editor.getJSON().content as JSONContent[],
    onAddImageNode,
    onRemoveImageNode,
  });

  /*   const editorContainerRef = useRef<HTMLDivElement | null>(null);
  const yPos = useYPositionOnScroll(editorContainerRef);
  const editorContainerWidth = editorContainerRef.current?.offsetWidth; */

  return (
    <div
      className="group"
      css={[s_editor.container]}
      onBlur={(event) => {
        const childHasFocus = event.currentTarget.contains(event.relatedTarget);
        if (childHasFocus) {
          return;
        }
        const output = editor.getJSON();
        onUpdate(output);
      }}
      // ref={editorContainerRef}
    >
      <Menu
        editor={editor}
        // editorYPos={yPos}
        // editorWidth={editorContainerWidth}
      />
      <EditorContent editor={editor} />
      <ImageBubbleMenu editor={editor} />
      {/* {typeof yPos === "number" && editorContainerWidth ? ( */}
      {/* ) : null} */}
    </div>
  );
};

const s_editor = {
  container: tw`relative`,
};

const useTrackEditorOutput = ({
  content: currentContent,
  onAddImageNode,
  onRemoveImageNode,
}: {
  content: JSONContent[];
} & TrackEditorOutputPassedProps) => {
  const previousContent = usePrevious(currentContent);

  const currentImagesIds = currentContent
    .filter((node) => node.type === "image")
    .map((imageNode) => imageNode.attrs!.title);
  const previousImagesIds = previousContent
    .filter((node) => node.type === "image")
    .map((imageNode) => imageNode.attrs!.title);

  const removedIds = arrayDivergence(previousImagesIds, currentImagesIds);
  const removedId = removedIds[0];
  const newIds = arrayDivergence(currentImagesIds, previousImagesIds);
  const newId = newIds[0];

  useEffect(() => {
    if (!removedId) {
      return;
    }
    onRemoveImageNode(removedId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [removedId]);

  useEffect(() => {
    if (!newId) {
      return;
    }
    onAddImageNode(newId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newId]);
};

const Menu = ({
  // editorYPos,
  editor,
}: // editorWidth,
{
  // editorYPos: number;
  editor: Editor;
  // editorWidth: number;
}) => {
  const canUndo = editor.can().undo();
  const canRedo = editor.can().redo();

  const selection = editor.state.selection;
  const isSelection = !selection.empty;
  const isSelectedText = isSelection && isTextSelection(selection);

  /*   const menuRef = useRef<HTMLDivElement | null>(null);
  const menuHeight = 44;
  const menuEditorOffset = 10;
  const fixMenu = editorYPos <= menuHeight + menuEditorOffset + 10;

  const menuHeightAndOffsetString = "-54px"; */

  return (
    <div
      css={[
        s_menu.container,
        /*         tw`transition-all duration-75 ease-in`,
        fixMenu
          ? tw`fixed top-[10px]`
          : tw`absolute top-[${menuHeightAndOffsetString}] `, */
      ]}
      /*       style={{
        width: editorWidth,
      }}
      ref={menuRef} */
    >
      <menu css={[s_menu.menu]}>
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
        <WithAddImage
          onAddImage={({ id, URL }) => {
            editor
              .chain()
              .focus()
              .setImage({
                src: URL,
                title: id,
              })
              .run();
          }}
        >
          <MenuButton icon={<ImageIcon />} tooltipText="insert image" />
        </WithAddImage>
      </menu>
    </div>
  );
};

const s_menu = {
  // * container is to allow spacing whilst maintaining hover between editor and menu
  container: css`
    ${tw`absolute -translate-y-full`}
    ${tw`z-20 invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 transition-opacity ease-in-out duration-150`}
  `,
  menu: css`
    ${s_editorMenu.menu} ${tw`mb-sm w-full`}
  `,
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
          s_editorMenu.button.button,
          isDisabled && s_editorMenu.button.disabled,
          isActive && s_editorMenu.button.isActive,
        ]}
        onClick={onClick}
        type="button"
      >
        {cloneElement(icon, { weight: "bold" })}
      </button>
    </WithTooltip>
  );
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

type Selection = Editor["state"]["selection"] & {
  node?: { type: { name: string } };
};

// * programmatic control of bubble menu wasn't working so below (conditional display of content rather than the menu) is a workaround. May have to create own bubble menu from scratch to do it properly. See https://github.com/ueberdosis/tiptap/issues/2305
const ImageBubbleMenu = ({ editor }: { editor: Editor }) => {
  const selection = editor.state.selection as Selection;
  const isSelectedImage = selection.node?.type.name === "image";

  return (
    <BubbleMenuShell editor={editor}>
      <>
        {isSelectedImage ? (
          <div css={[s_editorMenu.menu, tw`gap-sm`]}>
            <WithAddImage
              onAddImage={({ id, URL }) => {
                editor
                  .chain()
                  .focus()
                  .setImage({
                    src: URL,
                    title: id,
                  })
                  .run();
              }}
            >
              <MenuButton icon={<ImageIcon />} tooltipText="change image" />
            </WithAddImage>
            <WithWarning
              callbackToConfirm={() =>
                editor.chain().focus().deleteSelection().run()
              }
              warningText={{ heading: "Delete image?" }}
            >
              <MenuButton icon={<Trash />} tooltipText="delete image" />
            </WithWarning>
          </div>
        ) : null}
      </>
    </BubbleMenuShell>
  );
};
