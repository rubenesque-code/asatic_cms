import { ReactElement } from "react";
import CellContainerUI from "^components/display-content-items-page/table/CellContainerUI";
import TableUI from "^components/display-content-items-page/table/TableUI";
import DocLanguages from "^components/DocLanguages";
import DocsQuery from "^components/DocsQuery";
import LanguageSelect from "^components/LanguageSelect";
import MissingText from "^components/MissingText";
import ArticleSlice from "^context/articles/ArticleContext";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";
import { useSelector } from "^redux/hooks";
import { selectArticlesByLanguageAndQuery } from "^redux/state/complex-selectors";
import { Article as ArticleType } from "^types/article";

export default function Table() {
  const { id: languageId } = LanguageSelect.useContext();
  const query = DocsQuery.useContext();

  const articlesFiltered = useSelector((state) =>
    selectArticlesByLanguageAndQuery(state, { languageId, query })
  );

  return (
    <TableUI isFilter={true} optionalColumns={["authors", "collections"]}>
      {articlesFiltered.map((article) => (
        <ArticleProviders article={article} key={article.id}>
          <RowCells />
        </ArticleProviders>
      ))}
    </TableUI>
  );
}

const ArticleProviders = ({
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

const TitleCell = () => {
  const [{ status }] = ArticleSlice.useContext();
  const [{ title }] = ArticleTranslationSlice.useContext();

  return (
    <CellContainerUI>
      {title ? (
        title
      ) : status === "new" ? (
        "-"
      ) : (
        <MissingText tooltipText="missing title for translation" />
      )}
    </CellContainerUI>
  );
};
