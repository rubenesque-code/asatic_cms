import ArticleSlice from "^context/articles/ArticleContext";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";

import { Title_, Authors_, Text_ } from "../../_containers/EntitySummary";

const ArticleSummary = () => {
  return (
    <>
      <Title />
      <Authors />
      <Text />
    </>
  );
};

export default ArticleSummary;

const Title = () => {
  const [{ title }] = ArticleTranslationSlice.useContext();

  return <Title_ title={title} />;
};

const Authors = () => {
  const [{ authorsIds }] = ArticleSlice.useContext();
  const [{ languageId }] = ArticleTranslationSlice.useContext();

  return <Authors_ authorIds={authorsIds} docActiveLanguageId={languageId} />;
};

const Text = () => {
  const [translation, { updateLandingAutoSummary }] =
    ArticleTranslationSlice.useContext();

  return (
    <Text_
      translation={translation}
      updateEntityAutoSectionSummary={(summary) =>
        updateLandingAutoSummary({ summary })
      }
    />
  );
};
