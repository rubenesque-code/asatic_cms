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
import ArticleProviders from "^components/articles/ProvidersWithTranslationLanguages";
import BlogProviders from "^components/blogs/BlogProvidersWithTranslationLanguages";
import RecordedEventProviders from "^components/recorded-events/ProvidersWithTranslationLanguages";
import { ArticleIcon, BlogIcon, RecordedEventIcon } from "^components/Icons";
import WithTooltip from "^components/WithTooltip";
import Table_ from "^components/display-entities-table/Table";
import {
  AuthorsCell,
  LanguagesCell,
  StatusCell,
  TagsCell,
  TitleCell,
} from "^components/display-entities-table/Cells";
import { $Cell } from "^components/display-entities-table/styles";

import { ActionsCell } from "./Cells";
import { useComponentContext } from "../Context";

type ClosePopover = { closePopover: () => void };

const Table = (closePopoverProp: ClosePopover) => {
  const { id: languageId } = LanguageSelect.useContext();
  const query = DocsQuery.useContext();

  const isFilter = Boolean(languageId !== allLanguageId || query.length);

  const articlesFiltered = useSelector((state) =>
    selectArticlesByLanguageAndQuery(state, { languageId, query })
  );
  const articlesOrdered = orderDisplayContent(articlesFiltered);

  const blogsFiltered = useSelector((state) =>
    selectBlogsByLanguageAndQuery(state, { languageId, query })
  );
  const blogsOrdered = orderDisplayContent(blogsFiltered);

  const recordedEventsFiltered = useSelector((state) =>
    selectRecordedEventsByLanguageAndQuery(state, { languageId, query })
  );
  const recordedEventsOrdered = orderDisplayContent(recordedEventsFiltered);

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
        articlesOrdered.length ||
          blogsOrdered.length ||
          recordedEventsOrdered.length
      )}
      isFilter={isFilter}
    >
      <>
        {articlesOrdered.map((article) => (
          <ArticleProviders article={article} key={article.id}>
            <ArticleRow {...closePopoverProp} />
          </ArticleProviders>
        ))}
        {blogsOrdered.map((blog) => (
          <BlogProviders blog={blog} key={blog.id}>
            <BlogRow {...closePopoverProp} />
          </BlogProviders>
        ))}
        {recordedEventsOrdered.map((recordedEvent) => (
          <RecordedEventProviders
            recordedEvent={recordedEvent}
            key={recordedEvent.id}
          >
            <RecordedEventRow {...closePopoverProp} />
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
      <$Cell>{icon}</$Cell>
      {actionsCell}
      {statusCell}
      {authorsCell}
      {tagsCell}
      {languagesCell}
    </>
  );
};

const ArticleRow = ({ closePopover }: ClosePopover) => {
  const [
    { id: articleId, status, publishDate, authorsIds, tagsIds, languagesIds },
  ] = ArticleSlice.useContext();
  const [{ title }] = ArticleTranslationSlice.useContext();
  const [{ activeLanguageId }, { setActiveLanguageId }] =
    DocLanguages.useContext();

  const { addEntity } = useComponentContext();

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
            addEntity({ entityId: articleId, entityType: "article" });
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

const BlogRow = ({ closePopover }: ClosePopover) => {
  const [
    { id: blogId, status, publishDate, authorsIds, tagsIds, languagesIds },
  ] = BlogSlice.useContext();
  const [{ title }] = BlogTranslationSlice.useContext();
  const [{ activeLanguageId }, { setActiveLanguageId }] =
    DocLanguages.useContext();

  const { addEntity } = useComponentContext();

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
            addEntity({ entityId: blogId, entityType: "blog" });
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

const RecordedEventRow = ({ closePopover }: ClosePopover) => {
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

  const { addEntity } = useComponentContext();

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
            addEntity({
              entityId: recordedEventId,
              entityType: "recorded-event",
            });
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
