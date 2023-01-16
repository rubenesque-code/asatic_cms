import BlogTextSectionSlice from "^context/blogs/BlogTextSectionContext";

import { $TextSection_ } from "^components/pages/curated/document/_presentation/article-like";
import SectionMenu_ from "./_containers/SectionMenu_";
import BlogTranslationSlice from "^context/blogs/BlogTranslationContext";

const TextSection = () => {
  const [{ id: sectionId, index: sectionIndex, text }, { updateBodyText }] =
    BlogTextSectionSlice.useContext();
  const [{ id: translationId }] = BlogTranslationSlice.useContext();

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
      translationId={translationId}
    />
  );
};

export default TextSection;
