/* eslint-disable jsx-a11y/alt-text */
import tw from "twin.macro";
import dateformat from "dateformat";

import DocAuthorsText from "^components/authors/DocAuthorsText";
import DocLanguages from "^components/DocLanguages";
import MyImage from "^components/images/MyImage";
import ArticleSlice from "^context/articles/ArticleContext";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";
import {
  ImageContainer,
  Title as Title_,
  SubTitleContainer,
  Text as Text_,
} from "../styles";
import { getArticleSummaryFromTranslation } from "^helpers/article";
import SimpleTipTapEditor from "^components/editors/tiptap/SimpleEditor";

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

const Image = () => {
  return (
    <ImageContainer>
      <div>Image</div>
    </ImageContainer>
  );
};

const Title = () => {
  const [{ title }] = ArticleTranslationSlice.useContext();

  return <Title_ css={[!title && tw`text-gray-placeholder`]}>{title}</Title_>;
};

const Authors = () => {
  const [{ activeLanguageId }] = DocLanguages.useContext();
  const [{ authorsIds }] = ArticleSlice.useContext();

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
  const [{ publishDate }] = ArticleSlice.useContext();

  if (!publishDate) {
    return null;
  }

  const dateStr = dateformat(publishDate, "mmmm dS, yyyy");

  return <>{dateStr}</>;
};

const Text = () => {
  const [translation, { updateCollectionSummary }] =
    ArticleTranslationSlice.useContext();

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
