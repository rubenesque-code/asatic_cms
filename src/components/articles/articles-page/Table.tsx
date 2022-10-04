import { ReactElement } from "react";

import { useSelector } from "^redux/hooks";
import { selectArticlesByLanguageAndQuery } from "^redux/state/complex-selectors/article";

import ArticleSlice from "^context/articles/ArticleContext";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";
import { useDeleteMutationContext } from "^context/DeleteMutationContext";

import { Article as ArticleType } from "^types/article";

import { orderDisplayContent } from "^helpers/displayContent";

import TableUI from "^components/display-content-items-page/table/TableUI";
import DocLanguages from "^components/DocLanguages";
import DocsQuery from "^components/DocsQuery";
import LanguageSelect, { allLanguageId } from "^components/LanguageSelect";
import {
  TitleCell as TitleCellUnpopulated,
  AuthorsCell as AuthorsCellUnpopulated,
  SubjectsCell as SubjectsCellUnpopulated,
  CollectionsCell as CollectionsCellUnpopulated,
  TagsCell as TagsCellUnpopulated,
  LanguagesCell as LanguagesCellUnpopulated,
} from "^components/display-content-items-page/table/Cells";

export default function Table() {
  const { id: languageId } = LanguageSelect.useContext();
  const query = DocsQuery.useContext();

  const isFilter = Boolean(languageId !== allLanguageId || query.length);

  const articlesFiltered = useSelector((state) =>
    selectArticlesByLanguageAndQuery(state, { languageId, query })
  );
  const articlesOrdered = orderDisplayContent(articlesFiltered);

  return (
    <TableUI
      isFilter={isFilter}
      optionalColumns={["actions", "authors", "collections"]}
    >
      {articlesOrdered.map((article) => (
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
        <DocLanguages.Provider docLanguagesIds={languagesIds}>
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
        </DocLanguages.Provider>
      )}
    </ArticleSlice.Provider>
  );
};

const RowCells = () => {
  return (
    <>
      <TitleCell />
      <ActionsCell />
      <StatusCell />
      <AuthorsCell />
      <SubjectsCell />
      <CollectionsCell />
      <TagsCell />
      <LanguagesCell />
    </>
  );
};

const TitleCell = () => {
  const [{ status }] = ArticleSlice.useContext();
  const [{ title }] = ArticleTranslationSlice.useContext();

  return <TitleCellUnpopulated status={status} title={title} />;
};

const ActionsCell = () => {
  const [{ id }, { routeToEditPage }] = ArticleSlice.useContext();
  const [deleteFromDb] = useDeleteMutationContext();

  return (
    <TableUI.ActionsCell
      deleteDoc={() => deleteFromDb({ id, useToasts: true })}
      docType="article"
      routeToEditPage={routeToEditPage}
    />
  );
};

const StatusCell = () => {
  const [{ publishDate, status }] = ArticleSlice.useContext();

  return <TableUI.StatusCell publishDate={publishDate} status={status} />;
};

const AuthorsCell = () => {
  const [{ authorsIds }] = ArticleSlice.useContext();
  const [{ activeLanguageId }] = DocLanguages.useContext();

  return (
    <AuthorsCellUnpopulated
      activeLanguageId={activeLanguageId}
      authorsIds={authorsIds}
    />
  );
};

const SubjectsCell = () => {
  const [{ subjectsIds }] = ArticleSlice.useContext();
  const [{ activeLanguageId }] = DocLanguages.useContext();

  return (
    <SubjectsCellUnpopulated
      activeLanguageId={activeLanguageId}
      subjectsIds={subjectsIds}
    />
  );
};

const CollectionsCell = () => {
  const [{ collectionsIds }] = ArticleSlice.useContext();
  const [{ activeLanguageId }] = DocLanguages.useContext();

  return (
    <CollectionsCellUnpopulated
      activeLanguageId={activeLanguageId}
      collectionsIds={collectionsIds}
    />
  );
};

const TagsCell = () => {
  const [{ tagsIds }] = ArticleSlice.useContext();

  return <TagsCellUnpopulated tagsIds={tagsIds} />;
};

const LanguagesCell = () => {
  const [{ activeLanguageId }, { setActiveLanguageId }] =
    DocLanguages.useContext();
  const [{ languagesIds }] = ArticleSlice.useContext();

  return (
    <LanguagesCellUnpopulated
      activeLanguageId={activeLanguageId}
      languagesIds={languagesIds}
      setActiveLanguageId={setActiveLanguageId}
    />
  );
};
