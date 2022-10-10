import { useSelector } from "^redux/hooks";
import { selectPrimaryEntityRelatedToCollection } from "^redux/state/complex-selectors/collections";

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

import Article from "./related-entity/article";
import Blog from "./related-entity/blog";
import RecordedEvent from "./related-entity/recorded-event";
import { ItemContainer } from "./styles/styles";

// probs want ability to change order

const Populated = () => {
  const [{ id: collectionId }] = CollectionSlice.useContext();
  const { articles, blogs, recordedEvents } = useSelector((state) =>
    selectPrimaryEntityRelatedToCollection(state, collectionId)
  );

  const relatedDocs = [...articles, ...blogs, ...recordedEvents];

  const orderedDocs = orderDisplayContent(relatedDocs);

  return (
    <>
      {orderedDocs.map((doc) => (
        <ItemContainer key={doc.id}>
          <DocTypeSwitch doc={doc} />
        </ItemContainer>
      ))}
    </>
  );
};

export default Populated;

const DocTypeSwitch = ({
  doc,
}: {
  doc: ArticleType | BlogType | RecordedEventType;
}) => {
  const [{ activeLanguageId }] = DocLanguages.useContext();

  const docType = doc.type;

  return docType === "article" ? (
    <ArticleSlice.Provider article={doc}>
      {([{ translations }]) => (
        <ArticleTranslationSlice.Provider
          articleId={doc.id}
          translation={selectTranslationForActiveLanguage(
            translations,
            activeLanguageId
          )}
        >
          <Article />
        </ArticleTranslationSlice.Provider>
      )}
    </ArticleSlice.Provider>
  ) : docType === "blog" ? (
    <BlogSlice.Provider blog={doc}>
      {([{ translations }]) => (
        <BlogTranslationSlice.Provider
          blogId={doc.id}
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
    <RecordedEventSlice.Provider recordedEvent={doc}>
      {([{ translations }]) => (
        <RecordedEventTranslationSlice.Provider
          recordedEventId={doc.id}
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
