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
// import Image from "@tiptap/extension-image";
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
  PencilSimple,
} from "phosphor-react";

import ImagePlugin from "./ImagePlugin";
// import ImagePlugin from "./ImageFigure";

import WithTooltip from "^components/WithTooltip";
import WithProximityPopover from "^components/WithProximityPopover";
import WithAddImage from "^components/WithAddImage";
import ImageBubbleMenuShell from "./ImageBubbleMenuShell";
import WithWarning from "^components/WithWarning";

import usePrevious from "^hooks/usePrevious";
import { arrayDivergence } from "^helpers/general";
import { s_editorMenu } from "^styles/menus";
import TextFormInput from "^components/TextFormInput";

// todo: go over globals.css
// todo: change font to tamil font when on tamil translation and vice versa. Will be different instances so can pass in as prop.

// todo: handle image not there
// todo: handle no image in uploaded images too

// todo: video embed (https://github.com/joevallender/tiptap2-image-example/tree/main/src/extensions) migh be helpful

// * - can use the editors event listeners (https://tiptap.dev/api/events)
// * - resize image
// * - if first line is a quote, mysterious spacing is added to the editor
// * - menu should be fixed; scrolling should occur within the article body. Maybe use headless ui popover with usepopper to make sticky and have submenus positioned properly too
// * - image bubble menu not in right position on init and moves sometimes
// * - border/outline on hocus

// * IMAGES
// * can maybe just use native <img /> tag in CMS; convert to NextImage in frontend

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
      ImagePlugin.configure({
        HTMLAttributes: {
          class: "mb-[1.78em]",
        },
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-lg max-w-[645px] font-serif-eng pb-lg focus:outline-none prose-img:h-[400px] prose-img:w-full prose-img:object-cover prose-figcaption:mt-2",
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
      css={[s_editor.container, tw``]}
      onBlur={(event) => {
        const childHasFocus = event.currentTarget.contains(event.relatedTarget);
        if (childHasFocus) {
          return;
        }
        const output = editor.getJSON();
        // console.log("output:", output);
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
  container: tw`relative mt-2`,
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
    .map((imageNode) => imageNode.attrs!.id);
  const previousImagesIds = previousContent
    .filter((node) => node.type === "image")
    .map((imageNode) => imageNode.attrs!.id);

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
        <AddImageMenuButton editor={editor} />
      </menu>
    </div>
  );
};

const s_menu = {
  // * container is to allow spacing whilst maintaining hover between editor and menu
  container: css`
    ${tw`absolute -translate-y-full`}
    ${tw`z-20 invisible opacity-0 group-focus-within:visible group-focus-within:opacity-100 transition-opacity ease-in-out duration-150`}
  `,
  menu: css`
    ${s_editorMenu.menu} ${tw`mb-sm w-full`}
  `,
};

const AddImageMenuButton = ({ editor }: { editor: Editor }) => {
  const editorIsEmpty = editor.isEmpty;
  const selection = editor.state.selection;
  const isSelection = !selection.empty;

  const addImageButtonIsDisabled = editor.isEmpty || isSelection;

  const tooltipText = editorIsEmpty
    ? "can't insert image on the first line"
    : isSelection
    ? "can't insert image when text or image is selected"
    : "insert image";

  return (
    <WithAddImage
      isDisabled={addImageButtonIsDisabled}
      onAddImage={({ id, URL }) => {
        editor
          .chain()
          .focus()
          .setFigure({
            src: URL,
            id,
            caption: "hello",
          })
          // .setImage({ src: URL, id })
          .run();
      }}
    >
      <MenuButton
        icon={<ImageIcon />}
        tooltipText={tooltipText}
        isDisabled={addImageButtonIsDisabled}
      />
    </WithAddImage>
  );
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
      isDisabled={!buttonProps.canLink}
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
  node?: {
    attrs?: {
      alt?: string;
      caption?: string;
      id?: string;
      src?: string;
      title?: string;
    };

    type: { name: string };
  };
};

// * programmatic control of bubble menu wasn't working so below (conditional display of content rather than the menu) is a workaround. May have to create own bubble menu from scratch to do it properly. See https://github.com/ueberdosis/tiptap/issues/2305
const ImageBubbleMenu = ({ editor }: { editor: Editor }) => {
  const selection = editor.state.selection as Selection;
  const attrs = selection.node?.attrs;

  return (
    <ImageBubbleMenuShell editor={editor}>
      <div css={[s_editorMenu.menu, tw`gap-sm`]}>
        <ImageCaptionPopover editor={editor} />
        <WithAddImage
          onAddImage={({ id: updatedImgId, URL: updatedURL }) =>
            editor
              .chain()
              .focus()
              .setFigure({
                ...attrs,
                src: updatedURL,
                id: updatedImgId,
              })
              .run()
          }
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
    </ImageBubbleMenuShell>
  );
};

const ImageCaptionPopover = ({ editor }: { editor: Editor }) => {
  const selection = editor.state.selection as Selection;
  const attrs = selection.node?.attrs;

  return (
    <WithProximityPopover
      panelContentElement={
        <div css={[tw`p-sm bg-white rounded-lg border-2 border-black`]}>
          <h4 css={[tw`text-base font-medium mb-sm`]}>Enter caption:</h4>
          <TextFormInput
            onSubmit={(caption) =>
              editor
                .chain()
                .focus()
                .setFigure({ ...attrs, caption })
                .run()
            }
            placeholder="enter caption"
            initialValue={attrs?.caption}
          />
        </div>
      }
    >
      <MenuButton icon={<PencilSimple />} tooltipText="change caption" />
    </WithProximityPopover>
  );
};
