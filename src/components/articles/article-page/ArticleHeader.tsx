import TextareaAutosize from "react-textarea-autosize";
import tw from "twin.macro";

import ArticleSlice from "^context/articles/ArticleContext";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";

import DocAuthorsText from "^components/authors/DocAuthorsText";
import DatePicker from "^components/date-picker";
import DocLanguages from "^components/DocLanguages";

import ArticleUI from "./ArticleUI";

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
    <ArticleUI.Title css={[tw`w-full`]}>
      <TextareaAutosize
        css={[tw`outline-none w-full`]}
        value={title}
        onChange={(e) => {
          const title = e.target.value;
          updateTitle({ title });
        }}
        placeholder="Title"
        maxRows={10}
        key={translationId}
      />
      {/*       <textarea
        css={[tw`outline-none w-full`]}
        value={title}
        onChange={(e) => {
          const title = e.target.value;
          updateTitle({ title });
        }}
        placeholder="Title"
        key={translationId}
      /> */}
      {/*       <SimpleTipTapEditor
        initialContent={title}
        onUpdate={(title) => updateTitle({ title })}
        placeholder={"Title"}
        styles={"text-3xl font-medium"}
        useProse={false}
        key={translationId}
      /> */}
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
