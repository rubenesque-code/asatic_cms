import ArticleTextSectionSlice from "^context/articles/ArticleTextSectionContext";

import { $TextSection_ } from "^components/pages/curated/document/_presentation/article-like";
import SectionMenu_ from "./_containers/SectionMenu_";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";

const TextSection = () => {
  const [
    { id: translationId, footnotes },
    { addFootnote, deleteFootnote, updateFootnoteNumber, updateFootnoteText },
  ] = ArticleTranslationSlice.useContext();
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
      translationId={translationId}
      footnotes={{
        addFootnote: (id, num) => addFootnote({ footnote: { id, num } }),
        deleteFootnote: (id) => deleteFootnote({ footnote: { id } }),
        updateFootnoteNum: (id, num) =>
          updateFootnoteNumber({ footnote: { id, num } }),
        updateFootnoteText: ({ id, text }) =>
          updateFootnoteText({ footnote: { id, text } }),
        footnotes,
      }}
    />
  );
};

export default TextSection;
