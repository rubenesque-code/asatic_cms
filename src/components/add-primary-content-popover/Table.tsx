import { useSelector } from "^redux/hooks";
import { selectArticlesByLanguageAndQuery } from "^redux/state/complex-selectors/article";

import LanguageSelect, { allLanguageId } from "^components/LanguageSelect";
import DocsQuery from "^components/DocsQuery";

import Table_ from "^components/display-entities-table/Table";
import {
  AuthorsCell,
  CollectionsCell,
  LanguagesCell,
  StatusCell,
  SubjectsCell,
  TagsCell,
  TitleCell,
} from "^components/display-entities-table/Cells";
import ArticleProvidersWithTranslationLanguages from "^components/articles/ProvidersWithTranslationLanguages";

const Table = () => {
  const { id: languageId } = LanguageSelect.useContext();
  const query = DocsQuery.useContext();

  const isFilter = Boolean(languageId !== allLanguageId || query.length);

  return (
    <Table_
      columns={[
        "Actions",
        "Authors",
        "Collections",
        "Subjects",
        "Tags",
        "Title",
        "Translations",
        "Type",
      ]}
      isFilter={isFilter}
    ></Table_>
  );
};

export default Table;

const ArticleRows = () => {
  const { id: languageId } = LanguageSelect.useContext();
  const query = DocsQuery.useContext();

  const articlesFiltered = useSelector((state) =>
    selectArticlesByLanguageAndQuery(state, { languageId, query })
  );

  return (
    <>
      {articlesFiltered.map((article) => (
        <ArticleProvidersWithTranslationLanguages
          article={article}
          key={article.id}
        ></ArticleProvidersWithTranslationLanguages>
      ))}
    </>
  );
};
