import ArticleSlice from "^context/articles/ArticleContext";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";

import DocAuthorsText from "^components/authors/DocAuthorsText";
import DatePicker from "^components/date-picker";
import DocLanguages from "^components/DocLanguages";
import InlineTextEditor from "^components/editors/Inline";

import ArticleUI from "./ArticleUI";
import tw from "twin.macro";

const ArticleHeader = () => {
  return (
    <ArticleUI.Header>
      <Date />
      <Title />
      <Authors />
    </ArticleUI.Header>
  );
};

export default ArticleHeader;

const Date = () => {
  const [{ publishDate }, { updatePublishDate }] = ArticleSlice.useContext();

  return (
    <div css={[tw`font-sans`]}>
      <DatePicker
        date={publishDate}
        onChange={(date) => updatePublishDate({ date })}
      />
    </div>
  );
};

const Title = () => {
  const [{ id: translationId, title }, { updateTitle }] =
    ArticleTranslationSlice.useContext();

  return (
    <ArticleUI.Title css={[!title?.length && tw`font-sans`]}>
      <InlineTextEditor
        injectedValue={title || ""}
        onUpdate={(title) => updateTitle({ title })}
        placeholder="Title"
        key={translationId}
      />
    </ArticleUI.Title>
  );
};

const Authors = () => {
  const [{ authorsIds }] = ArticleSlice.useContext();
  const [{ activeLanguageId }] = DocLanguages.useContext();

  return (
    <ArticleUI.Authors>
      <DocAuthorsText
        authorIds={authorsIds}
        docActiveLanguageId={activeLanguageId}
      />
    </ArticleUI.Authors>
  );
};
