import { useSelector } from "^redux/hooks";
import { selectArticlesByIds } from "^redux/state/articles";
import { selectBlogsByIds } from "^redux/state/blogs";
import { selectRecordedEventsByIds } from "^redux/state/recordedEvents";
import { selectCollectionsByIds } from "^redux/state/collections";

import SubjectSlice from "^context/subjects/SubjectContext";

import { orderDisplayContent } from "^helpers/displayContent";

// import { $EntitiesContainer } from "./_styles";

// import Entity from "./article-like-entity";
import { $MissingChildDocuments_ } from "^curated-pages/collection-of-documents/_presentation";
import tw from "twin.macro";
import ArticleLikeDocument from "./child-document/ArticleLikeDocument";
// import Collections from "./collections";
// import tw from "twin.macro";

// * not giving the ability to remove entities not found in store since it shouldn't happen since making entities related on the frontend.

const Populated = () => {
  const [{ articlesIds, blogsIds, collectionsIds, recordedEventsIds }] =
    SubjectSlice.useContext();

  const { articles, blogs, collections, recordedEvents } = useSelector(
    (state) => ({
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
      collections: {
        all: selectCollectionsByIds(state, collectionsIds),
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
    })
  );

  const articleLikeDocumentsOrdered = orderDisplayContent([
    ...articles.found,
    ...blogs.found,
  ]);

  const firstSectionPrimaryEntities = articleLikeDocumentsOrdered.slice(0, 6);
  const secondSectionPrimaryEntities = articleLikeDocumentsOrdered.slice(
    6,
    articleLikeDocumentsOrdered.length
  );

  return (
    <>
      <$MissingChildDocuments_
        articles={articles.numMissing}
        blogs={blogs.numMissing}
        collections={collections.numMissing}
        recordedEvents={recordedEvents.numMissing}
      />
      <$EntitiesContainer>
        {firstSectionPrimaryEntities.map((articleLikeEntity) => (
          <ArticleLikeDocument
            articleLikeEntity={articleLikeEntity}
            key={articleLikeEntity.id}
          />
        ))}
      </$EntitiesContainer>
      {/*       {collections.found.length ? (
        <Collections collections={collections.found} />
      ) : null}
      {recordedEvents.found.length ? (
        <RecordedEvents recordedEvents={recordedEvents.found} />
      ) : null} */}
      {secondSectionPrimaryEntities.length ? (
        <$EntitiesContainer css={[tw`mt-xl`]}>
          {secondSectionPrimaryEntities.map((articleLikeEntity) => (
            <ArticleLikeDocument
              articleLikeEntity={articleLikeEntity}
              key={articleLikeEntity.id}
            />
          ))}
        </$EntitiesContainer>
      ) : null}
    </>
  );
};

export default Populated;

const $EntitiesContainer = tw.div`grid grid-cols-2`;
