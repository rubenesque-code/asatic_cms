import { ReactElement } from "react";
import tw from "twin.macro";

import ContainerUtility from "^components/ContainerUtilities";
import ArticleEditor, {
  FootnoteProps,
} from "^components/editors/tiptap/RichEditor";

export const $TextSection_ = ({
  menu,
  text,
  updateText,
  translationId,
  footnotes,
}: {
  menu: (isHovered: boolean) => ReactElement;
  text: string | undefined;
  updateText: (text: string) => void;
  translationId: string;
} & FootnoteProps) => {
  return (
    <ContainerUtility.isHovered styles={tw`relative`}>
      {(isHovered) => (
        <>
          <ArticleEditor
            initialContent={text}
            onUpdate={updateText}
            placeholder="Write here..."
            footnotes={footnotes}
            key={translationId}
          />
          {menu(isHovered)}
        </>
      )}
    </ContainerUtility.isHovered>
  );
};
