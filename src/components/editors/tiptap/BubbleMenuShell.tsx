import React, { ReactNode, useEffect, useState } from "react";
import { Editor } from "@tiptap/react";
import { BubbleMenuPlugin } from "@tiptap/extension-bubble-menu";
import tw from "twin.macro";

// * programmatic control of bubble menu wasn't working so below (conditional display of content rather than the menu) is a workaround. May have to create own bubble menu from scratch to do it properly. See https://github.com/ueberdosis/tiptap/issues/2305
const BubbleMenuShell = ({
  children,
  editor,
  show,
}: {
  children: ReactNode;
  editor: Editor;
  show: boolean;
}) => {
  const [element, setElement] = useState<HTMLDivElement | null>(null);

  const pluginKey = "bubble-menu";

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
    <div ref={setElement} css={[!show && tw`hidden`]}>
      {children}
      <div
        css={[
          tw`h-[10px] w-[2px] absolute bottom-0 left-1/2 bg-black translate-y-full`,
        ]}
      />
    </div>
  );
};

export default BubbleMenuShell;
