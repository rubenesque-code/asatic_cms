import { ReactElement } from "react";

import { useSelector } from "^redux/hooks";
import { selectArticlesByLanguageAndQuery } from "^redux/state/complex-selectors/article";
import { selectBlogsByLanguageAndQuery } from "^redux/state/complex-selectors/blogs";

import ArticleSlice from "^context/articles/ArticleContext";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";
import BlogSlice from "^context/blogs/BlogContext";
import BlogTranslationSlice from "^context/blogs/BlogTranslationContext";
import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";
import RecordedEventTranslationSlice from "^context/recorded-events/RecordedEventTranslationContext";

import { orderDisplayContent } from "^helpers/displayContent";

import DocsQuery from "^components/DocsQuery";
import { allLanguageId } from "^components/FilterLanguageSelect";
import ArticleProviders from "^components/_containers/articles/ProvidersWithOwnLanguages";
import BlogProviders from "^components/_containers/blogs/ProvidersWithOwnLanguages";
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
import { useEntityLanguageContext } from "^context/EntityLanguages";
import { selectRecordedEventsByLanguageAndQuery } from "^redux/state/complex-selectors/recorded-events";
import RecordedEventProvidersWithOwnLanguages from "^components/_containers/recorded-events/ProvidersWithOwnLanguages";

const useProcessDocumentEntities = () => {
  const query = DocsQuery.useContext();

  const { excludedEntityIds, limitToLanguageId } = useComponentContext();

  const articlesFiltered = useSelector((state) =>
    selectArticlesByLanguageAndQuery(state, {
      languageId: limitToLanguageId || allLanguageId,
      query,
      excludedIds: excludedEntityIds.articles,
    })
  );

  const blogsFiltered = useSelector((state) =>
    selectBlogsByLanguageAndQuery(state, {
      languageId: limitToLanguageId || allLanguageId,
      query,
      excludedIds: excludedEntityIds.blogs,
    })
  );

  const recordedEventsFiltered = useSelector((state) =>
    selectRecordedEventsByLanguageAndQuery(state, {
      languageId: limitToLanguageId || allLanguageId,
      query,
      excludedIds: excludedEntityIds.blogs,
    })
  );

  const ordered = orderDisplayContent([
    ...articlesFiltered,
    ...blogsFiltered,
    ...recordedEventsFiltered,
  ]);

  return ordered;
};

const Table = () => {
  const { limitToLanguageId } = useComponentContext();
  const query = DocsQuery.useContext();

  const isFilter = Boolean(limitToLanguageId || query.length);

  const documentsProcessed = useProcessDocumentEntities();

  return (
    <Table_
      columns={[
        "Title",
        "Type",
        "Actions",
        "Translations",
        "Status",
        "Authors",
        "Tags",
      ]}
      isContent={Boolean(documentsProcessed.length)}
      isFilter={isFilter}
    >
      {documentsProcessed.map((documentEntity) =>
        documentEntity.type === "article" ? (
          <ArticleProviders article={documentEntity} key={documentEntity.id}>
            <ArticleRow />
          </ArticleProviders>
        ) : documentEntity.type === "blog" ? (
          <BlogProviders blog={documentEntity} key={documentEntity.id}>
            <BlogRow />
          </BlogProviders>
        ) : (
          <RecordedEventProvidersWithOwnLanguages
            recordedEvent={documentEntity}
            key={documentEntity.id}
          >
            <RecordedEventRow />
          </RecordedEventProvidersWithOwnLanguages>
        )
      )}
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
      {languagesCell}
      {statusCell}
      {authorsCell}
      {tagsCell}
    </>
  );
};

const ArticleRow = () => {
  const [
    { id: articleId, status, publishDate, authorsIds, tagsIds, languagesIds },
  ] = ArticleSlice.useContext();
  const [{ title }] = ArticleTranslationSlice.useContext();
  const { activeLanguageId, updateActiveLanguage } = useEntityLanguageContext();

  const { handleAddDocumentEntity: handleAddPrimaryEntity } =
    useComponentContext();

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

  const { handleAddDocumentEntity: handleAddPrimaryEntity } =
    useComponentContext();

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

const RecordedEventRow = () => {
  const [
    { id: blogId, status, publishDate, authorsIds, tagsIds, languagesIds },
  ] = RecordedEventSlice.useContext();
  const [{ title }] = RecordedEventTranslationSlice.useContext();
  const { activeLanguageId, updateActiveLanguage } = useEntityLanguageContext();

  const { handleAddDocumentEntity: handleAddPrimaryEntity } =
    useComponentContext();

  return (
    <EntityRow
      titleCell={<TitleCell status={status} title={title} />}
      icon={
        <WithTooltip text="video document">
          <RecordedEventIcon />
        </WithTooltip>
      }
      actionsCell={
        <ActionsCell
          addToDocument={() =>
            handleAddPrimaryEntity({ id: blogId, name: "recordedEvent" })
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
