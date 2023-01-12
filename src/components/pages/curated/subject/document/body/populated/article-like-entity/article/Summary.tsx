import ArticleSlice from "^context/articles/ArticleContext";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";

import {
  Title_,
  Authors_,
  Date_,
} from "^curated-pages/_containers/entity-summary";
import { SummaryText_ } from "^curated-pages/_containers/article-like";

import { $SummaryContainer, $Title, $Authors, $Date, $Text } from "../_styles";
import { getArticleLikeSummaryText } from "^helpers/article-like";
import { Text_ } from "^curated-pages/_containers/entity-summary";

const Summary = () => {
  const [] = ArticleSlice.useContext();

  return (
    <$SummaryContainer>
      <Title />
      <Authors />
      <Date />
      <Text />
    </$SummaryContainer>
  );
};

export default Summary;

const Title = () => {
  const [{ title }] = ArticleTranslationSlice.useContext();

  return (
    <$Title>
      <Title_ title={title} />
    </$Title>
  );
};

const Authors = () => {
  const [{ authorsIds }] = ArticleSlice.useContext();
  const [{ languageId }] = ArticleTranslationSlice.useContext();

  return (
    <$Authors>
      <Authors_ activeLanguageId={languageId} authorsIds={authorsIds} />
    </$Authors>
  );
};

const Date = () => {
  const [{ publishDate }] = ArticleSlice.useContext();

  return (
    <$Date>
      <Date_ publishDate={publishDate} />
    </$Date>
  );
};

const Text = () => {
  const [{ authorsIds }] = ArticleSlice.useContext();
  const [translation, { updateSummary: updateDefaultSummary }] =
    ArticleTranslationSlice.useContext();

  const isAuthor = Boolean(authorsIds.length);

  const summary = getArticleLikeSummaryText(translation, "default");

  const numChars = isAuthor ? 200 : 240;

  return (
    <$Text>
      <SummaryText_
        numChars={numChars}
        text={summary}
        updateText={(summary) => updateDefaultSummary({ summary })}
      />
    </$Text>
  );
};
