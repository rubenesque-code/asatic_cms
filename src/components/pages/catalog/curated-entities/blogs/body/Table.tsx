import { useSelector } from "^redux/hooks";
import { selectBlogsByLanguageAndQuery } from "^redux/state/complex-selectors/blogs";

import BlogSlice from "^context/blogs/BlogContext";
import BlogTranslationSlice from "^context/blogs/BlogTranslationContext";

import { orderDisplayContent } from "^helpers/displayContent";

import BlogProviders from "^components/_containers/blogs/ProvidersWithOwnLanguages";
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
import useDeleteBlog from "^hooks/blogs/useDeleteBlog";
import { useEntityLanguageContext } from "^context/EntityLanguages";

export default function Table() {
  const { id: languageId } = LanguageSelect.useContext();
  const query = DocsQuery.useContext();

  const isFilter = Boolean(languageId !== allLanguageId || query.length);

  const filtered = useSelector((state) =>
    selectBlogsByLanguageAndQuery(state, { languageId, query })
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
      {ordered.map((blog) => (
        <BlogProviders blog={blog} key={blog.id}>
          <BlogTableRow />
        </BlogProviders>
      ))}
    </Table_>
  );
}

const BlogTableRow = () => {
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
  ] = BlogSlice.useContext();
  const [{ title }] = BlogTranslationSlice.useContext();
  const { activeLanguageId, updateActiveLanguage } = useEntityLanguageContext();

  const handleDeleteBlog = useDeleteBlog();

  return (
    <>
      <TitleCell status={status} title={title} />
      <EntitiesPageActionsCell
        deleteEntity={handleDeleteBlog}
        entityType="blog"
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
