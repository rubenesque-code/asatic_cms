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
  ArrowDown,
  ArrowUp,
  ArrowsOutLineVertical,
  ArrowsInLineVertical,
  YoutubeLogo,
} from "phosphor-react";

import ImagePlugin from "./ImagePlugin";
import ExternalVideoPlugin from "./ExternalVideoPlugin";

import usePrevious from "^hooks/usePrevious";

import { arrayDivergence } from "^helpers/general";

import BubbleMenuShell from "./BubbleMenuShell";
import WithTooltip from "^components/WithTooltip";
import WithProximityPopover from "^components/WithProximityPopover";
import WithAddImage from "^components/WithAddImage";
import WithWarning from "^components/WithWarning";
import SimpleInputPanel from "^components/SimpleInputPanel";
import WithAddYoutubeVideo from "^components/WithAddYoutubeVideo";

import { s_editorMenu } from "^styles/menus";

// todo: change font to tamil font when on tamil translation and vice versa. Will be different instances so can pass in as prop.

// * Nice to haves:
// * - can use the editors event listeners (https://tiptap.dev/api/events)
// * - if first line is a quote, mysterious spacing is added to the editor
// * - menu should be fixed; scrolling should occur within the article body. Maybe use headless ui popover with usepopper to make sticky and have submenus positioned properly too
// * - image bubble menu not in right position on init and moves sometimes
// * - border/outline on hocus?
// * - overlay on focus?
// * - on yt video pause, could use the default thumbnail image to create an overlay so have a nicer, more minimal, embedded video. Would need to programmatically take control of playin and use onpause/onstop events of the yt player to know when to show the overlay again.
// * - if image/video is focused, pressing on another keyboard key overwrites it - not ideal

// * IMAGES
// * can maybe just use native <img /> tag in CMS; convert to NextImage in frontend

type OnUpdate = {
  onUpdate: (output: JSONContent) => void;
};

type TrackEditorOutputPassedProps = {
  onAddImageNode: (imageId: string) => void;
  onRemoveImageNode: (imageId: string) => void;
};

const TipTapEditor = ({
  initialContent,
  placeholder,
  height,
  ...passedProps
}: {
  initialContent: JSONContent | undefined;
  placeholder: string | (() => string);
  height: number;
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
      ImagePlugin,
      ExternalVideoPlugin,
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-lg max-w-[645px] font-serif-eng pb-lg focus:outline-none prose-img:w-full prose-img:object-cover prose-img:mb-0 prose-figcaption:mt-2 prose-figcaption:border-l prose-figcaption:border-gray-500 prose-figcaption:pl-xs prose-video:w-full prose-video:h-full",
      },
    },
    content: initialContent,
  });

  if (!editor) {
    return null;
  }

  return <EditorInitialised height={height} editor={editor} {...passedProps} />;
};

export default TipTapEditor;

const EditorInitialised = ({
  editor,
  onUpdate,
  onAddImageNode,
  height,
  onRemoveImageNode,
}: { editor: Editor; height: number } & OnUpdate &
  TrackEditorOutputPassedProps) => {
  useTrackEditorOutput({
    content: editor.getJSON().content as JSONContent[],
    onAddImageNode,
    onRemoveImageNode,
  });

  return (
    <div
      className="group"
      css={[s_editor.container, tw`flex items-stretch`]}
      onBlur={(event) => {
        const childHasFocus = event.currentTarget.contains(event.relatedTarget);
        if (childHasFocus) {
          return;
        }
        const output = editor.getJSON();
        onUpdate(output);
      }}
    >
      <Menu editor={editor} />
      <div
        className="no-scrollbar"
        css={[
          tw`overflow-x-hidden overflow-y-auto z-20 flex items-stretch pr-sm`,
        ]}
        style={{ height }}
      >
        <EditorContent editor={editor} />
      </div>
      <BubbleMenu editor={editor} />
    </div>
  );
};

const s_editor = {
  container: tw`relative mt-2 z-50 border-t pt-md `,
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

  const selection = editor.state.selection as Selection;
  const isSelection = !selection.empty;
  const isSelectedText = isSelection && isTextSelection(selection);

  const imageOrVideoIsSelected = Boolean(selection.node?.type.name);

  return (
    <div css={[s_menu.container]}>
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
          isDisabled={imageOrVideoIsSelected}
        />
        <MenuButton
          icon={<TextItalic />}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          tooltipText="italic"
          isActive={editor.isActive("italic")}
          isDisabled={imageOrVideoIsSelected}
        />
        <MenuButton
          icon={<ListBullets />}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          tooltipText="bullet list"
          isActive={editor.isActive("bulletList")}
          isDisabled={imageOrVideoIsSelected}
        />
        <MenuButton
          icon={<ListNumbers />}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          tooltipText="ordered list"
          isActive={editor.isActive("orderedList")}
          isDisabled={imageOrVideoIsSelected}
        />
        <LinkPopover
          isDisabled={!isSelectedText}
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
          isDisabled={imageOrVideoIsSelected}
        />
        <AddImageMenuButton editor={editor} />
        <AddYoutubeVideoMenuButton editor={editor} />
      </menu>
    </div>
  );
};

const s_menu = {
  // * container is to allow spacing whilst maintaining hover between editor and menu
  container: css`
    ${tw`absolute -translate-y-full`}
    ${tw`z-40 w-full invisible opacity-0 group-focus-within:visible group-focus-within:opacity-100 transition-opacity ease-in-out duration-150`}
  `,
  menu: css`
    ${s_editorMenu.menu} ${tw`mb-sm z-40 w-full`}
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
    ? "can't insert image when text or anything else is selected"
    : "insert image";

  return (
    <WithAddImage
      isDisabled={addImageButtonIsDisabled}
      onAddImage={({ id, URL }) => {
        editor
          .chain()
          .focus()
          .setImage({
            src: URL,
            id,
          })
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

const AddYoutubeVideoMenuButton = ({ editor }: { editor: Editor }) => {
  const editorIsEmpty = editor.isEmpty;
  const selection = editor.state.selection;
  const isSelection = !selection.empty;

  const buttonIsDisabled = editor.isEmpty || isSelection;

  const tooltipText = editorIsEmpty
    ? "can't insert video on the first line"
    : isSelection
    ? "can't insert video when text or anything else is selected"
    : "insert youtube video";

  return (
    <WithAddYoutubeVideo
      isDisabled={buttonIsDisabled}
      onAddVideo={({ URL, id }) =>
        editor
          .chain()
          .focus()
          .setExternalVideo({
            id,
            src: URL,
          })
          .run()
      }
    >
      <MenuButton
        icon={<YoutubeLogo />}
        tooltipText={tooltipText}
        isDisabled={buttonIsDisabled}
      />
    </WithAddYoutubeVideo>
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

type LinkPanelProps = {
  initialValue: string | undefined;
  setLink: (link: string) => void;
  unsetLink: () => void;
};

const LinkPopover = ({
  isDisabled,
  panelProps,
}: {
  isDisabled: boolean;
  panelProps: LinkPanelProps;
}) => {
  return (
    <WithProximityPopover
      isDisabled={isDisabled}
      panelContentElement={({ close: closePanel }) => (
        <LinkPanel closePanel={closePanel} {...panelProps} />
      )}
    >
      <LinkButton isDisabled={isDisabled} />
    </WithProximityPopover>
  );
};

const LinkButton = ({ isDisabled }: { isDisabled: boolean }) => {
  return (
    <MenuButton
      icon={<Link />}
      tooltipText={isDisabled ? "set link" : "select text before setting link"}
      isDisabled={isDisabled}
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
      class?: string;
    };
    type: { name: "image" | "external-video" };
  };
};

const BubbleMenu = ({ editor }: { editor: Editor }) => {
  const selection = editor.state.selection as Selection;
  const nodeType = selection.node?.type.name;

  const renderContent = () => {
    switch (nodeType) {
      case "image":
        return <ImageBubbleMenuContent editor={editor} />;
      case "external-video":
        return <ExternalVideoBubbleMenuContent editor={editor} />;
      default:
        return null;
    }
  };

  return (
    <BubbleMenuShell show={Boolean(nodeType)} editor={editor}>
      {renderContent()}

      {/* <ImageStylingPopover editor={editor} /> */}
    </BubbleMenuShell>
  );
};

const ImageBubbleMenuContent = ({ editor }: { editor: Editor }) => {
  return (
    <div css={[s_editorMenu.menu, tw`gap-sm`]}>
      <ImageCaptionPopover editor={editor} />
      <ImageHeightButtons editor={editor} />
      <ImagePositionButtons editor={editor} />
      <WithAddImage
        onAddImage={({ id: updatedImgId, URL: updatedURL }) =>
          editor
            .chain()
            .focus()
            .updateImage({
              src: updatedURL,
              id: updatedImgId,
            })
            .run()
        }
      >
        <MenuButton icon={<ImageIcon />} tooltipText="change image" />
      </WithAddImage>
      <WithWarning
        callbackToConfirm={() => editor.chain().focus().deleteSelection().run()}
        warningText={{ heading: "Delete image?" }}
      >
        <MenuButton icon={<Trash />} tooltipText="delete image" />
      </WithWarning>
    </div>
  );
};

const ImageCaptionPopover = ({ editor }: { editor: Editor }) => {
  const selection = editor.state.selection as Selection;
  const attrs = selection.node?.attrs;

  return (
    <WithProximityPopover
      panelContentElement={
        <SimpleInputPanel
          heading="Enter caption:"
          onSubmit={(caption) =>
            editor.chain().focus().setImageCaption({ caption }).run()
          }
          placeholder="enter caption"
          initialValue={attrs?.caption}
        />
      }
    >
      <MenuButton icon={<PencilSimple />} tooltipText="change caption" />
    </WithProximityPopover>
  );
};

const VideoCaptionPopover = ({ editor }: { editor: Editor }) => {
  const selection = editor.state.selection as Selection;
  const attrs = selection.node?.attrs;

  return (
    <WithProximityPopover
      panelContentElement={
        <SimpleInputPanel
          heading="Enter caption:"
          onSubmit={(caption) =>
            editor.chain().focus().setVideoCaption({ caption }).run()
          }
          placeholder="enter caption"
          initialValue={attrs?.caption}
        />
      }
    >
      <MenuButton icon={<PencilSimple />} tooltipText="change caption" />
    </WithProximityPopover>
  );
};

/* const ImageStylingPopover = ({ editor }: { editor: Editor }) => {
  return (
    <WithProximityPopover
      panelContentElement={
        <div css={[s_editorMenu.menu, tw`gap-sm`]}>
          <ImageHeightButtons editor={editor} />
          <ImagePositionButtons editor={editor} />
        </div>
      }
    >
      <MenuButton
        icon={<FadersHorizontal />}
        tooltipText="adjust image height and positioning"
      />
    </WithProximityPopover>
  );
}; */

const ImageHeightButtons = ({ editor }: { editor: Editor }) => {
  const selection = editor.state.selection as Selection;
  const attrs = selection.node?.attrs;
  const classStr = attrs?.class;
  const classArr = classStr!.split(" ")!;
  const heightClassIndex = classArr.findIndex((str) =>
    str.includes("prose-img-h")
  );
  const heightClassStr = classArr[heightClassIndex];
  const heightValue = Number(heightClassStr?.split("-")[3]);

  const canIncreaseHeight = heightValue < 600;
  const canDecreaseHeight = heightValue > 200;

  return (
    <>
      <MenuButton
        icon={<ArrowsOutLineVertical />}
        tooltipText={
          canIncreaseHeight
            ? "increase height"
            : "can't increase height any further"
        }
        onClick={() => {
          if (!canIncreaseHeight) {
            return;
          }
          const newHeightStr = `prose-img-h-${heightValue + 100}`;
          classArr[heightClassIndex] = newHeightStr;
          const newClassStr = classArr.join(" ");

          editor.chain().focus().setClass({ class: newClassStr }).run();
        }}
        isDisabled={!canIncreaseHeight}
      />
      <MenuButton
        icon={<ArrowsInLineVertical />}
        tooltipText={
          canDecreaseHeight
            ? "decrease height"
            : "can't decrease height any further"
        }
        onClick={() => {
          if (!canDecreaseHeight) {
            return;
          }
          const newHeightStr = `prose-img-h-${heightValue - 100}`;
          classArr[heightClassIndex] = newHeightStr;
          const newClassStr = classArr.join(" ");

          editor.chain().focus().setClass({ class: newClassStr }).run();
        }}
        isDisabled={!canDecreaseHeight}
      />
    </>
  );
};

const ImagePositionButtons = ({ editor }: { editor: Editor }) => {
  const selection = editor.state.selection as Selection;
  const attrs = selection.node?.attrs;
  const classStr = attrs?.class;
  const classArr = classStr!.split(" ")!;
  const positionClassIndex = classArr.findIndex((str) =>
    str.includes("prose-img-p")
  );
  const positionClassStr = classArr[positionClassIndex];
  const positionValue = Number(positionClassStr?.split("-")[3]);

  const canFocusLower = positionValue < 100;
  const canFocusHigher = positionValue > 0;

  return (
    <>
      <MenuButton
        icon={<ArrowDown />}
        tooltipText="focus lower part of image"
        onClick={() => {
          if (!canFocusLower) {
            return;
          }
          const newPositionStr = `prose-img-p-${positionValue + 10}`;
          classArr[positionClassIndex] = newPositionStr;
          const newClassStr = classArr.join(" ");

          editor.chain().focus().setClass({ class: newClassStr }).run();
        }}
        isDisabled={!canFocusLower}
      />
      <MenuButton
        icon={<ArrowUp />}
        tooltipText="focus higher part of image"
        onClick={() => {
          if (!canFocusHigher) {
            return;
          }
          const newPositionStr = `prose-img-p-${positionValue - 10}`;
          classArr[positionClassIndex] = newPositionStr;
          const newClassStr = classArr.join(" ");

          editor.chain().focus().setClass({ class: newClassStr }).run();
        }}
        isDisabled={!canFocusHigher}
      />
    </>
  );
};

const ExternalVideoBubbleMenuContent = ({ editor }: { editor: Editor }) => {
  return (
    <div css={[s_editorMenu.menu, tw`gap-sm`]}>
      <VideoCaptionPopover editor={editor} />
      <WithAddYoutubeVideo
        onAddVideo={({ URL, id }) =>
          editor.chain().focus().updateExternalVideo({ id, src: URL }).run()
        }
      >
        <MenuButton icon={<YoutubeLogo />} tooltipText="change video" />
      </WithAddYoutubeVideo>
      <WithWarning
        callbackToConfirm={() => editor.chain().focus().deleteSelection().run()}
        warningText={{ heading: "Delete video?" }}
      >
        <MenuButton icon={<Trash />} tooltipText="delete video" />
      </WithWarning>
    </div>
  );
};
