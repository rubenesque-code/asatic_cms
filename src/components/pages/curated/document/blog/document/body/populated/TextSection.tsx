import BlogTextSectionSlice from "^context/blogs/BlogTextSectionContext";

import { $TextSection_ } from "^components/pages/curated/document/_presentation/article-like";
import SectionMenu_ from "./_containers/SectionMenu_";
import BlogTranslationSlice from "^context/blogs/BlogTranslationContext";

const TextSection = () => {
  const [{ id: translationId }, {}] = BlogTranslationSlice.useContext();
  const [
    { id: sectionId, index: sectionIndex, text, footnotes },
    {
      updateBodyText,
      addFootnote,
      deleteFootnote,
      updateFootnoteNumber,
      updateFootnoteText,
    },
  ] = BlogTextSectionSlice.useContext();

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
      footnotes={{
        addFootnote: (id, num) => addFootnote({ footnote: { id, num } }),
        deleteFootnote: (id) => deleteFootnote({ footnote: { id } }),
        updateFootnoteNum: (id, num) =>
          updateFootnoteNumber({ footnote: { id, num } }),
        updateFootnoteText: ({ id, text }) =>
          updateFootnoteText({ footnote: { id, text } }),
        footnotes: footnotes || [],
      }}
    />
  );
};

export default TextSection;
