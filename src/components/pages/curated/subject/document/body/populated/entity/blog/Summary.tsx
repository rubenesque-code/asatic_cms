import BlogSlice from "^context/blogs/BlogContext";
import BlogTranslationSlice from "^context/blogs/BlogTranslationContext";

import {
  Title_,
  Authors_,
  Date_,
} from "^curated-pages/_containers/entity-summary";
import { SummaryText_ } from "^curated-pages/_containers/article-like";

import { $SummaryContainer, $Title, $Authors, $Date, $Text } from "../_styles";
import { getArticleSummaryFromTranslation } from "^helpers/article-like";

const Summary = () => {
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
  const [{ title }] = BlogTranslationSlice.useContext();

  return (
    <$Title>
      <Title_ title={title} />
    </$Title>
  );
};

const Authors = () => {
  const [{ authorsIds }] = BlogSlice.useContext();
  const [{ languageId }] = BlogTranslationSlice.useContext();

  return (
    <$Authors>
      <Authors_ activeLanguageId={languageId} authorsIds={authorsIds} />
    </$Authors>
  );
};

const Date = () => {
  const [{ publishDate }] = BlogSlice.useContext();

  return (
    <$Date>
      <Date_ publishDate={publishDate} />
    </$Date>
  );
};

const Text = () => {
  const [{ authorsIds }] = BlogSlice.useContext();
  const [translation, { updateDefaultSummary }] =
    BlogTranslationSlice.useContext();

  const isAuthor = Boolean(authorsIds.length);

  const summary = getArticleSummaryFromTranslation(translation, "default");

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
