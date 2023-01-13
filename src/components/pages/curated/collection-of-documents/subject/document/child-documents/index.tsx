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
import CustomSectionComponent from "./child-document/CustomSectionComponent";
import { Article } from "^types/article";
import { Blog } from "^types/blog";
import { CustomSectionComponentProvider } from "^context/CustomSectionComponentContext";
import CollectionsSwiperSection from "../../../_components/CollectionsSwiperSection";
import RecordedEventsSwiperSection from "../../../_components/RecordedEventsSwiperSection";
// import Collections from "./collections";
// import tw from "twin.macro";

// * not giving the ability to remove entities not found in store since it shouldn't happen since making entities related on the frontend.
export function unshiftFirstEntityWithImage(entities: (Article | Blog)[]) {
  const hasStorageImageIndex = entities.findIndex(
    (entity) => entity.summaryImage?.imageId
  );

  if (hasStorageImageIndex > -1) {
    const removed = entities.splice(hasStorageImageIndex, 1);
    const newArr = [...removed, ...entities];

    return newArr;
  }

  return entities;
}

const Populated = () => {
  const [
    { id: subjectId, articlesIds, blogsIds, collectionsIds, recordedEventsIds },
    { removeRelatedEntity },
  ] = SubjectSlice.useContext();

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

  const articleLikeDocumentsOrderedByDate = orderDisplayContent([
    ...articles.found,
    ...blogs.found,
  ]);
  const articleLikeDocumentsOrderedWithImageFirst = unshiftFirstEntityWithImage(
    articleLikeDocumentsOrderedByDate
  );

  const firstSectionPrimaryEntities =
    articleLikeDocumentsOrderedWithImageFirst.slice(0, 5);
  const secondSectionPrimaryEntities =
    articleLikeDocumentsOrderedWithImageFirst.slice(
      5,
      articleLikeDocumentsOrderedByDate.length
    );

  return (
    <>
      <$MissingChildDocuments_
        articles={articles.numMissing}
        blogs={blogs.numMissing}
        collections={collections.numMissing}
        recordedEvents={recordedEvents.numMissing}
      />
      <div css={[tw`grid grid-cols-4 grid-rows-2`]}>
        {firstSectionPrimaryEntities.map((entity, i) => (
          <div css={[i === 0 && tw`col-span-2 row-span-2`]} key={entity.id}>
            <CustomSectionComponentProvider
              colSpan={i === 0 ? "1/2" : "1/4"}
              rowSpan={i === 0 ? 2 : 1}
              showImageOverride={i === 0}
            >
              <CustomSectionComponent entity={entity} />
            </CustomSectionComponentProvider>
          </div>
        ))}
      </div>
      {collections.found.length ? (
        <CollectionsSwiperSection
          collections={collections.found}
          removeFromParent={{
            parent: { id: subjectId, name: "subject" },
            func: (collectionId) =>
              removeRelatedEntity({
                relatedEntity: { id: collectionId, name: "collection" },
              }),
          }}
        />
      ) : null}
      {recordedEvents.found.length ? (
        <div css={[tw`mt-md`]}>
          <RecordedEventsSwiperSection
            recordedEvents={recordedEvents.found}
            removeFromParent={{
              parent: { id: subjectId, name: "subject" },
              func: (collectionId) =>
                removeRelatedEntity({
                  relatedEntity: { id: collectionId, name: "collection" },
                }),
            }}
          />
        </div>
      ) : null}
      {secondSectionPrimaryEntities.length ? (
        <div css={[tw`grid grid-cols-3 mt-xl border`]}>
          {secondSectionPrimaryEntities.map((entity) => (
            <CustomSectionComponentProvider
              colSpan={"1/4"}
              rowSpan={1}
              showImageOverride={false}
              key={entity.id}
            >
              <CustomSectionComponent entity={entity} />
            </CustomSectionComponentProvider>
          ))}
        </div>
      ) : null}
    </>
  );
};

export default Populated;

// const $EntitiesContainer = tw.div`grid grid-cols-4`;
