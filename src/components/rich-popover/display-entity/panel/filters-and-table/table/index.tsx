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

import DocsQuery from "^components/DocsQuery";
import ArticleProviders from "^components/_containers/articles/ProvidersWithOwnLanguages";
import BlogProviders from "^components/_containers/blogs/ProvidersWithOwnLanguages";
import CollectionProviders from "^components/_containers/collections/ProvidersWithOwnLanguages";
import RecordedEventProviders from "^components/_containers/recorded-events/ProvidersWithOwnLanguages";
import {
  ArticleIcon,
  BlogIcon,
  CollectionIcon,
  RecordedEventIcon,
} from "^components/Icons";
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
import CollectionSlice from "^context/collections/CollectionContext";
import CollectionTranslationSlice from "^context/collections/CollectionTranslationContext";
import { selectCollectionsByLanguageAndQuery } from "^redux/state/complex-selectors/collections";
import { useEntityLanguageContext } from "^context/EntityLanguages";

const useProcessDisplayEntities = () => {
  // const { id: languageId } = FilterLanguageSelect.useContext();
  const query = DocsQuery.useContext();

  const { excludedEntity, parentLanguageId } = useComponentContext();

  const articlesFiltered = useSelector((state) =>
    selectArticlesByLanguageAndQuery(state, {
      languageId: parentLanguageId,
      query,
      excludedIds: excludedEntity?.articlesIds,
    })
  );
  const articlesProcessed = orderDisplayContent(articlesFiltered);

  const blogsFiltered = useSelector((state) =>
    selectBlogsByLanguageAndQuery(state, {
      languageId: parentLanguageId,
      query,
      excludedIds: excludedEntity?.blogsIds,
    })
  );
  const blogsProcessed = orderDisplayContent(blogsFiltered);

  const collectionsFiltered = useSelector((state) =>
    selectCollectionsByLanguageAndQuery(state, {
      languageId: parentLanguageId,
      query,
      excludedIds: excludedEntity?.collectionsIds,
    })
  );
  const collectionsProcessed = orderDisplayContent(collectionsFiltered);

  const recordedEventsFiltered = useSelector((state) =>
    selectRecordedEventsByLanguageAndQuery(state, {
      languageId: parentLanguageId,
      query,
      excludedIds: excludedEntity?.recordedEventsIds,
    })
  );
  const recordedEventsProcessed = orderDisplayContent(recordedEventsFiltered);

  return {
    articles: articlesProcessed,
    collections: collectionsProcessed,
    blogs: blogsProcessed,
    recordedEvents: recordedEventsProcessed,
  };
};

const Table = () => {
  // const { id: languageId } = FilterLanguageSelect.useContext();
  const query = DocsQuery.useContext();

  const isFilter = Boolean(query.length);

  const { articles, blogs, collections, recordedEvents } =
    useProcessDisplayEntities();

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
        {collections.map((collection) => (
          <CollectionProviders collection={collection} key={collection.id}>
            <CollectionRow />
          </CollectionProviders>
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
  const { activeLanguageId, updateActiveLanguage } = useEntityLanguageContext();

  const { handleAddDisplayEntity } = useComponentContext();

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
            handleAddDisplayEntity({ id: articleId, name: "article" })
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

  const { handleAddDisplayEntity } = useComponentContext();

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
            handleAddDisplayEntity({ id: blogId, name: "blog" })
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

const CollectionRow = () => {
  const [{ id: collectionId, status, publishDate, tagsIds, languagesIds }] =
    CollectionSlice.useContext();
  const [{ title }] = CollectionTranslationSlice.useContext();
  const { activeLanguageId, updateActiveLanguage } = useEntityLanguageContext();

  const { handleAddDisplayEntity } = useComponentContext();

  return (
    <EntityRow
      titleCell={<TitleCell status={status} title={title} />}
      icon={
        <WithTooltip text="collection">
          <CollectionIcon />
        </WithTooltip>
      }
      actionsCell={
        <ActionsCell
          addToDocument={() =>
            handleAddDisplayEntity({ id: collectionId, name: "collection" })
          }
        />
      }
      statusCell={<StatusCell publishDate={publishDate} status={status} />}
      authorsCell={
        <AuthorsCell activeLanguageId={activeLanguageId} authorsIds={[]} />
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
  const { activeLanguageId, updateActiveLanguage } = useEntityLanguageContext();

  const { handleAddDisplayEntity } = useComponentContext();

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
          addToDocument={() =>
            handleAddDisplayEntity({
              id: recordedEventId,
              name: "recordedEvent",
            })
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
