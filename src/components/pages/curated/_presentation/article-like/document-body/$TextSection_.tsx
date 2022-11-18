import { ReactElement } from "react";
import tw from "twin.macro";

import ContainerUtility from "^components/ContainerUtilities";
import ArticleEditor from "^components/editors/tiptap/RichEditor";

export const $TextSection_ = ({
  menu,
  text,
  updateText,
}: {
  menu: (isHovered: boolean) => ReactElement;
  text: string | undefined;
  updateText: (text: string) => void;
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
