import { ReactElement } from "react";

import { useSelector } from "^redux/hooks";
import { selectBlogsByLanguageAndQuery } from "^redux/state/complex-selectors/blogs";

import BlogSlice from "^context/blogs/BlogContext";
import BlogTranslationSlice from "^context/blogs/BlogTranslationContext";
import { useDeleteMutationContext } from "^context/DeleteMutationContext";

import { Blog as BlogType } from "^types/blog";

import { orderArticles } from "^helpers/article";

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

  const blogsFiltered = useSelector((state) =>
    selectBlogsByLanguageAndQuery(state, { languageId, query })
  );
  const blogsOrdered = orderArticles(blogsFiltered);

  return (
    <TableUI
      isFilter={isFilter}
      optionalColumns={["actions", "authors", "collections"]}
    >
      {blogsOrdered.map((article) => (
        <BlogProviders blog={article} key={article.id}>
          <RowCells />
        </BlogProviders>
      ))}
    </TableUI>
  );
}

const BlogProviders = ({
  blog: blog,
  children,
}: {
  blog: BlogType;
  children: ReactElement;
}) => {
  return (
    <BlogSlice.Provider blog={blog}>
      {([{ id: blogId, languagesIds, translations }]) => (
        <DocLanguages.Provider docLanguagesIds={languagesIds}>
          {({ activeLanguageId }) => (
            <BlogTranslationSlice.Provider
              blogId={blogId}
              translation={
                translations.find((t) => t.languageId === activeLanguageId)!
              }
            >
              {children}
            </BlogTranslationSlice.Provider>
          )}
        </DocLanguages.Provider>
      )}
    </BlogSlice.Provider>
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
  const [{ status }] = BlogSlice.useContext();
  const [{ title }] = BlogTranslationSlice.useContext();

  return <TitleCellUnpopulated status={status} title={title} />;
};

const ActionsCell = () => {
  const [{ id }, { routeToEditPage }] = BlogSlice.useContext();
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
  const [{ publishDate, status }] = BlogSlice.useContext();

  return <TableUI.StatusCell publishDate={publishDate} status={status} />;
};

const AuthorsCell = () => {
  const [{ authorsIds }] = BlogSlice.useContext();
  const [{ activeLanguageId }] = DocLanguages.useContext();

  return (
    <AuthorsCellUnpopulated
      activeLanguageId={activeLanguageId}
      authorsIds={authorsIds}
    />
  );
};

const SubjectsCell = () => {
  const [{ subjectsIds }] = BlogSlice.useContext();
  const [{ activeLanguageId }] = DocLanguages.useContext();

  return (
    <SubjectsCellUnpopulated
      activeLanguageId={activeLanguageId}
      subjectsIds={subjectsIds}
    />
  );
};

const CollectionsCell = () => {
  const [{ collectionsIds }] = BlogSlice.useContext();
  const [{ activeLanguageId }] = DocLanguages.useContext();

  return (
    <CollectionsCellUnpopulated
      activeLanguageId={activeLanguageId}
      collectionsIds={collectionsIds}
    />
  );
};

const TagsCell = () => {
  const [{ tagsIds }] = BlogSlice.useContext();

  return <TagsCellUnpopulated tagsIds={tagsIds} />;
};

const LanguagesCell = () => {
  const [{ activeLanguageId }, { setActiveLanguageId }] =
    DocLanguages.useContext();
  const [{ languagesIds }] = BlogSlice.useContext();

  return (
    <LanguagesCellUnpopulated
      activeLanguageId={activeLanguageId}
      languagesIds={languagesIds}
      setActiveLanguageId={setActiveLanguageId}
    />
  );
};
