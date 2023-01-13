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
      <$EntitiesContainer>
        {firstSectionPrimaryEntities.map((entity, i) => (
          <div css={[i === 0 && tw`col-span-2`]} key={entity.id}>
            <CustomSectionComponent
              entity={entity}
              showImage={i === 0}
              span={i === 0 ? 2 : 1}
            />
          </div>
        ))}
      </$EntitiesContainer>
      {/*       {collections.found.length ? (
        <Collections collections={collections.found} />
      ) : null}
      {recordedEvents.found.length ? (
        <RecordedEvents recordedEvents={recordedEvents.found} />
      ) : null} */}
      {/*       {secondSectionPrimaryEntities.length ? (
        <$EntitiesContainer css={[tw`mt-xl`]}>
          {secondSectionPrimaryEntities.map((entity) => (
            <CustomSectionComponent entity={entity} key={entity.id} />
          ))}
        </$EntitiesContainer>
      ) : null} */}
    </>
  );
};

export default Populated;

const $EntitiesContainer = tw.div`grid grid-cols-4`;
