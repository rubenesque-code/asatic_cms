/* eslint-disable jsx-a11y/alt-text */
import tw from "twin.macro";
import dateformat from "dateformat";

import BlogSlice from "^context/blogs/BlogContext";
import BlogTranslationSlice from "^context/blogs/BlogTranslationContext";

import { getArticleSummaryFromTranslation } from "^helpers/article";

import DocAuthorsText from "^components/authors/DocAuthorsText";
import DocLanguages from "^components/DocLanguages";
import SimpleTipTapEditor from "^components/editors/tiptap/SimpleEditor";

import Image from "./Image";
import { Title as Title_, SubTitleContainer, Text as Text_ } from "../styles";

const Article = () => {
  return (
    <div>
      <Image />
      <div css={[tw``]}>
        <Title />
        <SubTitleContainer>
          <Authors />
          <Date />
        </SubTitleContainer>
        <Text />
      </div>
    </div>
  );
};

export default Article;

const Title = () => {
  const [{ title }] = BlogTranslationSlice.useContext();

  return <Title_ css={[!title && tw`text-gray-placeholder`]}>{title}</Title_>;
};

const Authors = () => {
  const [{ activeLanguageId }] = DocLanguages.useContext();
  const [{ authorsIds }] = BlogSlice.useContext();

  if (!authorsIds.length) {
    return null;
  }

  return (
    <>
      <DocAuthorsText
        authorIds={authorsIds}
        docActiveLanguageId={activeLanguageId}
      />
      ,
    </>
  );
};

const Date = () => {
  const [{ publishDate }] = BlogSlice.useContext();

  if (!publishDate) {
    return null;
  }

  const dateStr = dateformat(publishDate, "mmmm dS, yyyy");

  return <>{dateStr}</>;
};

const Text = () => {
  const [translation, { updateCollectionSummary }] =
    BlogTranslationSlice.useContext();

  const summary = getArticleSummaryFromTranslation(translation, "collection");

  return (
    <Text_>
      <SimpleTipTapEditor
        initialContent={summary || undefined}
        onUpdate={(summary) => updateCollectionSummary({ summary })}
        placeholder="Summary"
      />
    </Text_>
  );
};
