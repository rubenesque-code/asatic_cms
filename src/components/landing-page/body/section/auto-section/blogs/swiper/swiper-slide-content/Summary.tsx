/* eslint-disable jsx-a11y/alt-text */
import BlogSlice from "^context/blogs/BlogContext";
import BlogTranslationSlice from "^context/blogs/BlogTranslationContext";
import { getArticleSummaryFromTranslation } from "^helpers/article-like";

import { Title_, Authors_, Date_, Text_ } from "../../../_containers/Entity";

const Summary = () => {
  return (
    <>
      <Title />
      <Authors />
      <Date />
      <Text />
    </>
  );
};

export default Summary;

const Title = () => {
  const [{ title }] = BlogTranslationSlice.useContext();

  return <Title_ color="blue" title={title} />;
};

const Authors = () => {
  const [{ authorsIds }] = BlogSlice.useContext();
  const [{ languageId }] = BlogTranslationSlice.useContext();

  return <Authors_ authorIds={authorsIds} docActiveLanguageId={languageId} />;
};

const Date = () => {
  const [{ publishDate }] = BlogSlice.useContext();

  return <Date_ publishDate={publishDate} />;
};

const Text = () => {
  const [{ authorsIds }] = BlogSlice.useContext();
  const [translation, { updateLandingAutoSummary }] =
    BlogTranslationSlice.useContext();

  const isAuthor = Boolean(authorsIds.length);

  const summary = getArticleSummaryFromTranslation(translation, "collection");

  const numChars = isAuthor ? 200 : 240;

  return (
    <Text_
      numChars={numChars}
      text={summary}
      updateEntityAutoSectionSummary={(summary) =>
        updateLandingAutoSummary({ summary })
      }
    />
  );
};
