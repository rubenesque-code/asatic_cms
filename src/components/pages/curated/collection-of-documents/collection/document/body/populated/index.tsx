import { useSelector } from "^redux/hooks";
import { selectArticlesByIds } from "^redux/state/articles";
import { selectBlogsByIds } from "^redux/state/blogs";
import { selectRecordedEventsByIds } from "^redux/state/recordedEvents";

import {
  orderDisplayContent,
  selectTranslationForActiveLanguage,
} from "^helpers/displayContent";

import CollectionSlice from "^context/collections/CollectionContext";
import ArticleSlice from "^context/articles/ArticleContext";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";
import BlogSlice from "^context/blogs/BlogContext";
import BlogTranslationSlice from "^context/blogs/BlogTranslationContext";
import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";
import RecordedEventTranslationSlice from "^context/recorded-events/RecordedEventTranslationContext";

import { Article as ArticleType } from "^types/article";
import { Blog as BlogType } from "^types/blog";
import { RecordedEvent as RecordedEventType } from "^types/recordedEvent";

import Article from "./entity/article";
import Blog from "./entity/blog";
import RecordedEvent from "./entity/recorded-event";
import { useEntityLanguageContext } from "^context/EntityLanguages";
import { $MissingChildDocuments_ } from "^curated-pages/collection-of-documents/_presentation";

// probs want ability to change order

const Populated = () => {
  const [{ articlesIds, blogsIds, recordedEventsIds }] =
    CollectionSlice.useContext();

  const { articles, blogs, recordedEvents } = useSelector((state) => ({
    articles: {
      all: selectArticlesByIds(state, articlesIds),
      get found() {
        return this.all.flatMap((e) => (e ? [e] : []));
      },
      get numMissing() {
        return this.all.filter((e) => e === undefined).length;
      },
    },
    blogs: {
      all: selectBlogsByIds(state, blogsIds),
      get found() {
        return this.all.flatMap((e) => (e ? [e] : []));
      },
      get numMissing() {
        return this.all.filter((e) => e === undefined).length;
      },
    },
    recordedEvents: {
      all: selectRecordedEventsByIds(state, recordedEventsIds),
      get found() {
        return this.all.flatMap((e) => (e ? [e] : []));
      },
      get numMissing() {
        return this.all.filter((e) => e === undefined).length;
      },
    },
  }));

  const orderedDocs = orderDisplayContent([
    ...articles.found,
    ...blogs.found,
    ...recordedEvents.found,
  ]);

  return (
    <>
      <$MissingChildDocuments_
        articles={articles.numMissing}
        blogs={blogs.numMissing}
        recordedEvents={recordedEvents.numMissing}
      />
      {orderedDocs.map((doc) => (
        <EntityTypeSwitch entity={doc} key={doc.id} />
      ))}
    </>
  );
};

export default Populated;

const EntityTypeSwitch = ({
  entity,
}: {
  entity: ArticleType | BlogType | RecordedEventType;
}) => {
  const { activeLanguageId } = useEntityLanguageContext();

  return entity.type === "article" ? (
    <ArticleSlice.Provider article={entity}>
      {([{ translations }]) => (
        <ArticleTranslationSlice.Provider
          articleId={entity.id}
          translation={selectTranslationForActiveLanguage(
            translations,
            activeLanguageId
          )}
        >
          <Article />
        </ArticleTranslationSlice.Provider>
      )}
    </ArticleSlice.Provider>
  ) : entity.type === "blog" ? (
    <BlogSlice.Provider blog={entity}>
      {([{ translations }]) => (
        <BlogTranslationSlice.Provider
          blogId={entity.id}
          translation={selectTranslationForActiveLanguage(
            translations,
            activeLanguageId
          )}
        >
          <Blog />
        </BlogTranslationSlice.Provider>
      )}
    </BlogSlice.Provider>
  ) : (
    <RecordedEventSlice.Provider recordedEvent={entity}>
      {([{ translations }]) => (
        <RecordedEventTranslationSlice.Provider
          recordedEventId={entity.id}
          translation={selectTranslationForActiveLanguage(
            translations,
            activeLanguageId
          )}
        >
          <RecordedEvent />
        </RecordedEventTranslationSlice.Provider>
      )}
    </RecordedEventSlice.Provider>
  );
};
