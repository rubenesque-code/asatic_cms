import { useSelector } from "^redux/hooks";
import { selectArticlesByLanguageAndQuery } from "^redux/state/complex-selectors/article";

import ArticleSlice from "^context/articles/ArticleContext";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";

import { orderDisplayContent } from "^helpers/displayContent";

import ArticleProviders from "^components/_containers/articles/ProvidersWithOwnLanguages";
import Table_ from "^components/display-entities-table/Table";
import {
  TitleCell,
  EntitiesPageActionsCell,
  StatusCell,
  AuthorsCell,
  SubjectsCell,
  CollectionsCell,
  TagsCell,
  LanguagesCell,
} from "^components/display-entities-table/Cells";
import DocsQuery from "^components/DocsQuery";
import LanguageSelect, { allLanguageId } from "^components/LanguageSelect";
import useDeleteArticle from "^hooks/articles/useDeleteArticle";
import { useEntityLanguageContext } from "^context/EntityLanguages";

export default function Table() {
  const { id: languageId } = LanguageSelect.useContext();
  const query = DocsQuery.useContext();

  const isFilter = Boolean(languageId !== allLanguageId || query.length);

  const filtered = useSelector((state) =>
    selectArticlesByLanguageAndQuery(state, { languageId, query })
  );
  const ordered = orderDisplayContent(filtered);

  return (
    <Table_
      columns={[
        "Title",
        "Actions",
        "Status",
        "Authors",
        "Subjects",
        "Collections",
        "Tags",
        "Translations",
      ]}
      isContent={Boolean(ordered.length)}
      isFilter={isFilter}
    >
      {ordered.map((article) => (
        <ArticleProviders article={article} key={article.id}>
          <ArticleTableRow />
        </ArticleProviders>
      ))}
    </Table_>
  );
}

const ArticleTableRow = () => {
  const [
    {
      status,
      subjectsIds,
      tagsIds,
      languagesIds,
      publishDate,
      authorsIds,
      collectionsIds,
    },
    { routeToEditPage },
  ] = ArticleSlice.useContext();
  const [{ title }] = ArticleTranslationSlice.useContext();
  const { activeLanguageId, updateActiveLanguage } = useEntityLanguageContext();

  const handleDeleteArticle = useDeleteArticle();

  return (
    <>
      <TitleCell status={status} title={title} />
      <EntitiesPageActionsCell
        deleteEntity={handleDeleteArticle}
        entityType="article"
        routeToEditPage={routeToEditPage}
      />
      <StatusCell status={status} publishDate={publishDate} />
      <AuthorsCell
        authorsIds={authorsIds}
        activeLanguageId={activeLanguageId}
      />
      <SubjectsCell
        activeLanguageId={activeLanguageId}
        subjectsIds={subjectsIds}
      />
      <CollectionsCell
        collectionsIds={collectionsIds}
        activeLanguageId={activeLanguageId}
      />
      <TagsCell tagsIds={tagsIds} />
      <LanguagesCell
        activeLanguageId={activeLanguageId}
        languagesIds={languagesIds}
        setActiveLanguageId={updateActiveLanguage}
      />
    </>
  );
};
