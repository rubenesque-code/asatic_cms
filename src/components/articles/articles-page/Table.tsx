import { ReactElement } from "react";
import TableUI from "^components/display-content-items-page/table/TableUI";
import DocLanguages from "^components/DocLanguages";
import DocsQuery from "^components/DocsQuery";
import LanguageSelect from "^components/LanguageSelect";
import ArticleSlice from "^context/articles/ArticleContext";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";
import { dicToArr, filterDocsByLanguageId } from "^helpers/general";
import { useSelector } from "^redux/hooks";
import { selectArticlesByLanguageId } from "^redux/state/complex-selectors";
import { Article as ArticleType } from "^types/article";

export default function Table() {
  // const articles = useSelector(selectArticles);
  const selectedLanguage = LanguageSelect.useContext();
  const query = DocsQuery.useContext();

  const articlesFiltered = useSelector((state) => {
    // const allArticles = dicToArr(state.articles.entities);
    /*     const filteredByLanguage = filterDocsByLanguageId(
      allArticles,
      selectedLanguage.id
    ); */
    const filteredByLanguage = selectArticlesByLanguageId(
      state,
      selectedLanguage.id
    );

    return filteredByLanguage;
  });

  console.log("articlesFiltered:", articlesFiltered);

  return (
    <TableUI isFilter={true} optionalColumns={["authors", "collections"]}>
      {articlesFiltered.map((article) => (
        <RowProviders article={article} key={article.id}>
          <RowCells />
        </RowProviders>
      ))}
    </TableUI>
  );
}

const RowProviders = ({
  article,
  children,
}: {
  article: ArticleType;
  children: ReactElement;
}) => {
  return (
    <ArticleSlice.Provider article={article}>
      {([{ id: articleId, languagesIds, translations }]) => (
        <DocLanguages.SelectProvider docLanguagesIds={languagesIds}>
          {({ activeLanguageId }) => (
            <ArticleTranslationSlice.Provider
              articleId={articleId}
              translation={
                translations.find((t) => t.languageId === activeLanguageId)!
              }
            >
              {children}
            </ArticleTranslationSlice.Provider>
          )}
        </DocLanguages.SelectProvider>
      )}
    </ArticleSlice.Provider>
  );
};

const RowCells = () => {
  return <></>;
};
