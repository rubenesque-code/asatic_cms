import { Article } from "^types/article";
import { Blog } from "^types/blog";

import ArticleSummary from "./ArticleSummary";
import BlogSummary from "./Blog";
import SubjectSlice from "^context/subjects/SubjectContext";
import ArticleSlice from "^context/articles/ArticleContext";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";
import BlogSlice from "^context/blogs/BlogContext";
import BlogTranslationSlice from "^context/blogs/BlogTranslationContext";

const CustomSectionComponent = ({ entity }: { entity: Article | Blog }) => {
  const [{ languageId }] = SubjectSlice.useContext();

  return entity.type === "article" ? (
    <ArticleSlice.Provider article={entity}>
      <ArticleTranslationSlice.Provider
        articleId={entity.id}
        translation={
          entity.translations.find(
            (translation) => translation.languageId === languageId
          )!
        }
      >
        <ArticleSummary />
      </ArticleTranslationSlice.Provider>
    </ArticleSlice.Provider>
  ) : (
    <BlogSlice.Provider blog={entity}>
      <BlogTranslationSlice.Provider
        blogId={entity.id}
        translation={
          entity.translations.find(
            (translation) => translation.languageId === languageId
          )!
        }
      >
        <BlogSummary />
      </BlogTranslationSlice.Provider>
    </BlogSlice.Provider>
  );
};

export default CustomSectionComponent;
