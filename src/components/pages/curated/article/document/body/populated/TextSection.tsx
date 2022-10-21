import ArticleTextSectionSlice from "^context/articles/ArticleTextSectionContext";

import { $TextSection_ } from "../../../../_presentation/article-like";
import SectionMenu_ from "./_containers/SectionMenu_";

const TextSection = () => {
  const [{ id: sectionId, index: sectionIndex, text }, { updateBodyText }] =
    ArticleTextSectionSlice.useContext();

  return (
    <$TextSection_
      text={text}
      updateText={(text) => updateBodyText({ text })}
      menu={(isHovered) => (
        <SectionMenu_
          isShowing={isHovered}
          sectionId={sectionId}
          sectionIndex={sectionIndex}
        />
      )}
    />
  );
};

export default TextSection;
