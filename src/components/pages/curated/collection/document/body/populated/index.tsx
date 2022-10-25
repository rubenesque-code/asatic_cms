import { useSelector } from "^redux/hooks";
import { selectPrimaryEntitiesRelatedToCollection } from "^redux/state/complex-selectors/collections";

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

import DocLanguages from "^components/DocLanguages";
import Article from "./entity/article";
import Blog from "./entity/blog";
import RecordedEvent from "./entity/recorded-event";

// probs want ability to change order

const Populated = () => {
  const [{ id: collectionId }] = CollectionSlice.useContext();
  const { articles, blogs, recordedEvents } = useSelector((state) =>
    selectPrimaryEntitiesRelatedToCollection(state, collectionId)
  );

  const relatedDocs = [...articles, ...blogs, ...recordedEvents];

  const orderedDocs = orderDisplayContent(relatedDocs);

  return (
    <>
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
  const [{ activeLanguageId }] = DocLanguages.useContext();

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
