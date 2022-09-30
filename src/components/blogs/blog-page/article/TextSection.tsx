import BlogTextSectionSlice from "^context/blogs/BlogTextSectionContext";

import TextSectionUnpopulated from "^components/article-like/entity-page/article/TextSection";

import SectionMenuGeneric from "./SectionMenuGeneric";

const TextSection = () => {
  const [{ id: sectionId, index: sectionIndex, text }, { updateBodyText }] =
    BlogTextSectionSlice.useContext();

  return (
    <TextSectionUnpopulated
      text={text}
      updateText={(text) => updateBodyText({ text })}
    >
      {(isHovered) => (
        <SectionMenuGeneric
          isShowing={isHovered}
          sectionId={sectionId}
          sectionIndex={sectionIndex}
        />
      )}
    </TextSectionUnpopulated>
  );
};

export default TextSection;
