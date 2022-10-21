import ArticleTextSectionSlice from "^context/articles/ArticleTextSectionContext";

import { $TextSection_ } from "../../../../_presentation/article-like";
import { DocumentBodySectionMenu_ } from "../../../../_containers/article-like";

const TextSection = () => {
  const [{ id: sectionId, index: sectionIndex, text }, { updateBodyText }] =
    ArticleTextSectionSlice.useContext();

  return (
    <$TextSection_
      text={text}
      updateText={(text) => updateBodyText({ text })}
      menu={(isHovered) => (
        <DocumentBodySectionMenu_
          isShowing={isHovered}
          sectionId={sectionId}
          sectionIndex={sectionIndex}
        />
      )}
    />
  );
};

export default TextSection;
