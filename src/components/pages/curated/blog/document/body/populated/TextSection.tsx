import BlogTextSectionSlice from "^context/blogs/BlogTextSectionContext";

import { $TextSection_ } from "../../../../_presentation/article-like";
import SectionMenu from "./_containers/SectionMenu_";

const TextSection = () => {
  const [{ id: sectionId, index: sectionIndex, text }, { updateBodyText }] =
    BlogTextSectionSlice.useContext();

  return (
    <$TextSection_
      text={text}
      updateText={(text) => updateBodyText({ text })}
      menu={(isHovered) => (
        <SectionMenu
          isShowing={isHovered}
          sectionId={sectionId}
          sectionIndex={sectionIndex}
        />
      )}
    />
  );
};

export default TextSection;
