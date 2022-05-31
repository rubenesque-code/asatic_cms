import React, { ReactNode, useEffect, useState } from "react";
import { isTextSelection } from "@tiptap/core";
import { Editor } from "@tiptap/react";
import { BubbleMenuPlugin } from "@tiptap/extension-bubble-menu";
import tw from "twin.macro";

const ImageBubbleMenuShell = ({
  children,
  editor,
}: {
  children: ReactNode;
  editor: Editor;
}) => {
  const [element, setElement] = useState<HTMLDivElement | null>(null);

  const pluginKey = "bubble-menu";

  const selection = editor.state.selection;
  const isSelectedImage = !isTextSelection(selection);

  useEffect(() => {
    if (!element) {
      return;
    }

    if (editor.isDestroyed) {
      return;
    }

    const plugin = BubbleMenuPlugin({
      pluginKey,
      editor,
      element,
      tippyOptions: {
        zIndex: 40,
      },
    });

    editor.registerPlugin(plugin);
    return () => editor.unregisterPlugin(pluginKey);
  }, [editor, element]);

  return (
    <div ref={setElement} css={[!isSelectedImage && tw`hidden`]}>
      {children}
      <div
        css={[
          tw`h-[10px] w-[2px] absolute bottom-0 left-1/2 bg-black translate-y-full`,
        ]}
      />
    </div>
  );
};

export default ImageBubbleMenuShell;
