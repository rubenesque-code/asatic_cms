// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { ReactElement } from "react";
import { Editor, BubbleMenu as TipTapBubbleMenu } from "@tiptap/react";

const BubbleMenu = ({
  children,
  editor,
}: {
  children: ReactElement;
  editor: Editor;
}) => {
  return (
    <TipTapBubbleMenu editor={editor} tippyOptions={{ zIndex: 40 }}>
      {children}
    </TipTapBubbleMenu>
  );
};

export default BubbleMenu;
