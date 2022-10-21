import { ReactElement } from "react";
import { JSONContent } from "@tiptap/core";
import tw from "twin.macro";

import ContainerUtility from "^components/ContainerUtilities";
import ArticleEditor from "^components/editors/tiptap/RichEditor";

export const $TextSection_ = ({
  menu,
  text,
  updateText,
}: {
  menu: (isHovered: boolean) => ReactElement;
  text: JSONContent | undefined;
  updateText: (text: JSONContent) => void;
}) => {
  return (
    <ContainerUtility.isHovered styles={tw`relative`}>
      {(isHovered) => (
        <>
          <ArticleEditor
            initialContent={text}
            onUpdate={updateText}
            placeholder="Write here..."
          />
          {menu(isHovered)}
        </>
      )}
    </ContainerUtility.isHovered>
  );
};
