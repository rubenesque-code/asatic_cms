import { JSONContent } from "@tiptap/core";
import { ReactElement } from "react";
import tw from "twin.macro";

import ContainerUtility from "^components/ContainerUtilities";
import ArticleEditor from "^components/editors/tiptap/ArticleEditor";

const TextSection = ({
  children: sectionMenu,
  text,
  updateText,
}: {
  children: (isHovered: boolean) => ReactElement;
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
          {sectionMenu(isHovered)}
        </>
      )}
    </ContainerUtility.isHovered>
  );
};

export default TextSection;
