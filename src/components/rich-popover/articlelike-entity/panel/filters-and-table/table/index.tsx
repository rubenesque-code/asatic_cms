import { ReactElement } from "react";

import { useSelector } from "^redux/hooks";
import { selectArticlesByLanguageAndQuery } from "^redux/state/complex-selectors/article";
import { selectBlogsByLanguageAndQuery } from "^redux/state/complex-selectors/blogs";

import ArticleSlice from "^context/articles/ArticleContext";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";
import BlogSlice from "^context/blogs/BlogContext";
import BlogTranslationSlice from "^context/blogs/BlogTranslationContext";

import { orderDisplayContent } from "^helpers/displayContent";

import DocsQuery from "^components/DocsQuery";
import FilterLanguageSelect, {
  allLanguageId,
} from "^components/FilterLanguageSelect";
import ArticleProviders from "^components/_containers/articles/ProvidersWithOwnLanguages";
import BlogProviders from "^components/_containers/blogs/ProvidersWithOwnLanguages";
import { ArticleIcon, BlogIcon } from "^components/Icons";
import WithTooltip from "^components/WithTooltip";
import Table_ from "^components/display-entities-table/Table";
import {
  AuthorsCell,
  EntityTypeCell,
  LanguagesCell,
  StatusCell,
  TagsCell,
  TitleCell,
} from "^components/display-entities-table/Cells";

import { ActionsCell } from "./Cells";
import { useComponentContext } from "../../../Context";
import { useEntityLanguageContext } from "^context/EntityLanguages";

const useProcessPrimaryEntities = () => {
  const { id: languageId } = FilterLanguageSelect.useContext();
  const query = DocsQuery.useContext();

  const { excludedEntityIds } = useComponentContext();

  const articlesFiltered = useSelector((state) =>
    selectArticlesByLanguageAndQuery(state, {
      languageId,
      query,
      excludedIds: excludedEntityIds.articles,
    })
  );
  const articlesProcessed = orderDisplayContent(articlesFiltered);

  const blogsFiltered = useSelector((state) =>
    selectBlogsByLanguageAndQuery(state, {
      languageId,
      query,
      excludedIds: excludedEntityIds.blogs,
    })
  );
  const blogsProcessed = orderDisplayContent(blogsFiltered);

  return {
    articles: articlesProcessed,
    blogs: blogsProcessed,
  };
};

const Table = () => {
  const { id: languageId } = FilterLanguageSelect.useContext();
  const query = DocsQuery.useContext();

  const isFilter = Boolean(languageId !== allLanguageId || query.length);

  const { articles, blogs } = useProcessPrimaryEntities();

  return (
    <Table_
      columns={[
        "Title",
        "Type",
        "Actions",
        "Status",
        "Authors",
        "Tags",
        "Translations",
      ]}
      isContent={Boolean(articles.length || blogs.length)}
      isFilter={isFilter}
    >
      <>
        {articles.map((article) => (
          <ArticleProviders article={article} key={article.id}>
            <ArticleRow />
          </ArticleProviders>
        ))}
        {blogs.map((blog) => (
          <BlogProviders blog={blog} key={blog.id}>
            <BlogRow />
          </BlogProviders>
        ))}
      </>
    </Table_>
  );
};

export default Table;

const EntityRow = ({
  titleCell,
  icon,
  actionsCell,
  statusCell,
  authorsCell,
  tagsCell,
  languagesCell,
}: {
  titleCell: ReactElement;
  icon: ReactElement;
  actionsCell: ReactElement;
  statusCell: ReactElement;
  authorsCell: ReactElement;
  tagsCell: ReactElement;
  languagesCell: ReactElement;
}) => {
  return (
    <>
      {titleCell}
      <EntityTypeCell>{icon}</EntityTypeCell>
      {actionsCell}
      {statusCell}
      {authorsCell}
      {tagsCell}
      {languagesCell}
    </>
  );
};

const ArticleRow = () => {
  const [
    { id: articleId, status, publishDate, authorsIds, tagsIds, languagesIds },
  ] = ArticleSlice.useContext();
  const [{ title }] = ArticleTranslationSlice.useContext();
  const { activeLanguageId, updateActiveLanguage } = useEntityLanguageContext();

  const { handleAddPrimaryEntity } = useComponentContext();

  return (
    <EntityRow
      titleCell={<TitleCell status={status} title={title} />}
      icon={
        <WithTooltip text="article">
          <ArticleIcon />
        </WithTooltip>
      }
      actionsCell={
        <ActionsCell
          addToDocument={() =>
            handleAddPrimaryEntity({ id: articleId, name: "article" })
          }
        />
      }
      statusCell={<StatusCell publishDate={publishDate} status={status} />}
      authorsCell={
        <AuthorsCell
          activeLanguageId={activeLanguageId}
          authorsIds={authorsIds}
        />
      }
      tagsCell={<TagsCell tagsIds={tagsIds} />}
      languagesCell={
        <LanguagesCell
          activeLanguageId={activeLanguageId}
          languagesIds={languagesIds}
          setActiveLanguageId={updateActiveLanguage}
        />
      }
    />
  );
};

const BlogRow = () => {
  const [
    { id: blogId, status, publishDate, authorsIds, tagsIds, languagesIds },
  ] = BlogSlice.useContext();
  const [{ title }] = BlogTranslationSlice.useContext();
  const { activeLanguageId, updateActiveLanguage } = useEntityLanguageContext();

  const { handleAddPrimaryEntity } = useComponentContext();

  return (
    <EntityRow
      titleCell={<TitleCell status={status} title={title} />}
      icon={
        <WithTooltip text="blog">
          <BlogIcon />
        </WithTooltip>
      }
      actionsCell={
        <ActionsCell
          addToDocument={() =>
            handleAddPrimaryEntity({ id: blogId, name: "blog" })
          }
        />
      }
      statusCell={<StatusCell publishDate={publishDate} status={status} />}
      authorsCell={
        <AuthorsCell
          activeLanguageId={activeLanguageId}
          authorsIds={authorsIds}
        />
      }
      tagsCell={<TagsCell tagsIds={tagsIds} />}
      languagesCell={
        <LanguagesCell
          activeLanguageId={activeLanguageId}
          languagesIds={languagesIds}
          setActiveLanguageId={updateActiveLanguage}
        />
      }
    />
  );
};
