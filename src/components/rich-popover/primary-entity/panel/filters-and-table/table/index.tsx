import { ReactElement } from "react";

import { useSelector } from "^redux/hooks";
import { selectArticlesByLanguageAndQuery } from "^redux/state/complex-selectors/article";
import { selectBlogsByLanguageAndQuery } from "^redux/state/complex-selectors/blogs";
import { selectRecordedEventsByLanguageAndQuery } from "^redux/state/complex-selectors/recorded-events";

import ArticleSlice from "^context/articles/ArticleContext";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";
import BlogSlice from "^context/blogs/BlogContext";
import BlogTranslationSlice from "^context/blogs/BlogTranslationContext";
import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";
import RecordedEventTranslationSlice from "^context/recorded-events/RecordedEventTranslationContext";

import { orderDisplayContent } from "^helpers/displayContent";

import DocLanguages from "^components/DocLanguages";
import DocsQuery from "^components/DocsQuery";
import LanguageSelect, { allLanguageId } from "^components/LanguageSelect";
import ArticleProviders from "^components/_containers/articles/ProvidersWithOwnLanguages";
import BlogProviders from "^components/_containers/blogs/ProvidersWithOwnLanguages";
import RecordedEventProviders from "^components/_containers/recorded-events/ProvidersWithOwnLanguages";
import { ArticleIcon, BlogIcon, RecordedEventIcon } from "^components/Icons";
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

const useProcessPrimaryEntities = () => {
  const { id: languageId } = LanguageSelect.useContext();
  const query = DocsQuery.useContext();

  const [{ excludedEntities }] = useComponentContext();

  const articlesFiltered = useSelector((state) =>
    selectArticlesByLanguageAndQuery(state, { languageId, query })
  ).filter((article) => !excludedEntities.articles.includes(article.id));
  const articlesProcessed = orderDisplayContent(articlesFiltered);

  const blogsFiltered = useSelector((state) =>
    selectBlogsByLanguageAndQuery(state, { languageId, query })
  ).filter((blog) => !excludedEntities.blogs.includes(blog.id));
  const blogsProcessed = orderDisplayContent(blogsFiltered);

  const recordedEventsFiltered = useSelector((state) =>
    selectRecordedEventsByLanguageAndQuery(state, { languageId, query })
  ).filter(
    (recordedEvent) =>
      !excludedEntities.recordedEvents.includes(recordedEvent.id)
  );
  const recordedEventsProcessed = orderDisplayContent(recordedEventsFiltered);

  return {
    articles: articlesProcessed,
    blogs: blogsProcessed,
    recordedEvents: recordedEventsProcessed,
  };
};

const Table = () => {
  const { id: languageId } = LanguageSelect.useContext();
  const query = DocsQuery.useContext();

  const isFilter = Boolean(languageId !== allLanguageId || query.length);

  const { articles, blogs, recordedEvents } = useProcessPrimaryEntities();

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
      isContent={Boolean(
        articles.length || blogs.length || recordedEvents.length
      )}
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
        {recordedEvents.map((recordedEvent) => (
          <RecordedEventProviders
            recordedEvent={recordedEvent}
            key={recordedEvent.id}
          >
            <RecordedEventRow />
          </RecordedEventProviders>
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
  const [{ activeLanguageId }, { setActiveLanguageId }] =
    DocLanguages.useContext();

  const [, { addArticleToParent, closePopover }] = useComponentContext();

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
          addToDocument={() => {
            addArticleToParent(articleId);
            closePopover();
          }}
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
          setActiveLanguageId={setActiveLanguageId}
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
  const [{ activeLanguageId }, { setActiveLanguageId }] =
    DocLanguages.useContext();

  const [, { addBlogToParent, closePopover }] = useComponentContext();

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
          addToDocument={() => {
            addBlogToParent(blogId);
            closePopover();
          }}
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
          setActiveLanguageId={setActiveLanguageId}
        />
      }
    />
  );
};

const RecordedEventRow = () => {
  const [
    {
      id: recordedEventId,
      status,
      publishDate,
      authorsIds,
      tagsIds,
      languagesIds,
    },
  ] = RecordedEventSlice.useContext();
  const [{ title }] = RecordedEventTranslationSlice.useContext();
  const [{ activeLanguageId }, { setActiveLanguageId }] =
    DocLanguages.useContext();

  const [, { addRecordedEventToParent, closePopover }] = useComponentContext();

  return (
    <EntityRow
      titleCell={<TitleCell status={status} title={title} />}
      icon={
        <WithTooltip text="recorded event">
          <RecordedEventIcon />
        </WithTooltip>
      }
      actionsCell={
        <ActionsCell
          addToDocument={() => {
            addRecordedEventToParent(recordedEventId);
            closePopover();
          }}
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
          setActiveLanguageId={setActiveLanguageId}
        />
      }
    />
  );
};
