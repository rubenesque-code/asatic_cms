import { JSONContent } from "@tiptap/core";
import { ReactElement } from "react";

import ContainerUtility from "^components/ContainerUtilities";
import ArticleEditor from "^components/editors/tiptap/ArticleEditor";

import ArticleUI from "./UI";

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
    <ArticleUI.TextSection>
      <ContainerUtility.isHovered>
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
    </ArticleUI.TextSection>
  );
};

export default TextSection;
