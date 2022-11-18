import ArticleSlice from "^context/articles/ArticleContext";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";

const Summary = () => {
  const [] = ArticleSlice.useContext();
  const [] = ArticleTranslationSlice.useContext();

  return <div>Arti</div>;
};

export default Summary;
