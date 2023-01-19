import { useSelector } from "^redux/hooks";
import SubjectSlice from "^context/subjects/SubjectContext";

import { orderDisplayContent } from "^helpers/displayContent";

// import { $EntitiesContainer } from "./_styles";

// import Entity from "./article-like-entity";
import { $MissingChildDocuments_ } from "^curated-pages/collection-of-documents/_presentation";
import tw from "twin.macro";
import CustomSectionComponent from "./child-document/CustomSectionComponent";
import { CustomSectionComponentProvider } from "^context/CustomSectionComponentContext";
import CollectionsSwiperSection from "../../../_components/CollectionsSwiperSection";
import RecordedEventsSwiperSection from "../../../_components/RecordedEventsSwiperSection";
import { unshiftFirstEntityWithImage } from "^helpers/article-like/process";
import { selectArticlesByIdsAndLanguageId } from "^redux/state/complex-selectors/article";
import { selectBlogsByIdsAndLanguageId } from "^redux/state/complex-selectors/blogs";
import { Article } from "^types/article";
import { Blog } from "^types/blog";
import { selectCollectionsByIdsAndLanguageId } from "^redux/state/complex-selectors/collections";
// import Collections from "./collections";
// import tw from "twin.macro";

const useGetSubjectChildEntities = () => {
  const [
    {
      articlesIds,
      blogsIds,
      collectionsIds,
      // recordedEventsIds,
      languageId: parentLanguageId,
    },
  ] = SubjectSlice.useContext();

  const entities = useSelector((state) => ({
    articles: selectArticlesByIdsAndLanguageId(state, {
      ids: articlesIds,
      languageId: parentLanguageId,
    }),
    blogs: selectBlogsByIdsAndLanguageId(state, {
      ids: blogsIds,
      languageId: parentLanguageId,
    }),
    collections: selectCollectionsByIdsAndLanguageId(state, {
      ids: collectionsIds,
      parentLanguageId,
    }),
  }));

  return entities;
};

const useProcessArticleLikeEntities = ({
  articles,
  blogs,
}: {
  articles: Article[];
  blogs: Blog[];
}) => {
  const articleLikeDocumentsOrderedByDate = orderDisplayContent([
    ...articles,
    ...blogs,
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

  return {
    first: firstSectionPrimaryEntities,
    second: secondSectionPrimaryEntities,
  };
};

const Populated = () => {
  const [
    { id: subjectId },
    { removeRelatedEntity: removeRelatedEntityFromSubject },
  ] = SubjectSlice.useContext();

  const childEntities = useGetSubjectChildEntities();

  const articleLikeSections = useProcessArticleLikeEntities({
    articles: childEntities.articles.valid,
    blogs: childEntities.blogs.valid,
  });

  return (
    <>
      {/*       <$MissingChildDocuments_
        articles={articles.numMissing}
        blogs={blogs.numMissing}
        collections={collections.numMissing}
        recordedEvents={recordedEvents.numMissing}
      /> */}
      <div css={[tw`grid grid-cols-4 grid-flow-row-dense`]}>
        {articleLikeSections.first.map((entity, i) => {
          const colSpan =
            i === 0
              ? "1/2"
              : articleLikeSections.first.length < 4
              ? "1/2"
              : articleLikeSections.first.length === 4 && i === 3
              ? "1/2"
              : "1/4";
          const rowSpan =
            i === 0 ? 2 : articleLikeSections.first.length === 2 ? 2 : 1;

          return (
            <div
              css={[
                colSpan === "1/2" && tw`col-span-2`,
                rowSpan === 2 && tw`row-span-2`,
              ]}
              key={entity.id}
            >
              <CustomSectionComponentProvider
                colSpan={colSpan}
                rowSpan={rowSpan}
                imageOverride={
                  colSpan === "1/2" ? "always-show" : "always-hide"
                }
                removeFromParent={{
                  parent: { name: "subject", id: subjectId },
                  func: (relatedEntity) =>
                    removeRelatedEntityFromSubject({
                      relatedEntity,
                    }),
                }}
              >
                <CustomSectionComponent entity={entity} />
              </CustomSectionComponentProvider>
            </div>
          );
        })}
      </div>
      {childEntities.collections.valid.length ? (
        <div css={[tw`mt-lg`]}>
          <CollectionsSwiperSection
            collections={childEntities.collections.valid}
            removeFromParent={{
              parent: { id: subjectId, name: "subject" },
              func: (collectionId) =>
                removeRelatedEntityFromSubject({
                  relatedEntity: { id: collectionId, name: "collection" },
                }),
            }}
          />
        </div>
      ) : null}
      {/*       {recordedEvents.found.length ? (
        <div css={[tw`mt-md`]}>
          <RecordedEventsSwiperSection
            recordedEvents={recordedEvents.found}
            parentLanguageId={parentLanguageId}
            removeFromParent={{
              parent: { id: subjectId, name: "subject" },
              func: (recordedEventId) =>
                removeRelatedEntityFromSubject({
                  relatedEntity: { id: recordedEventId, name: "recordedEvent" },
                }),
            }}
          />
        </div>
      ) : null} */}
      {articleLikeSections.second.length ? (
        <div css={[tw`grid grid-cols-3 mt-xl border`]}>
          {articleLikeSections.second.map((entity) => (
            <CustomSectionComponentProvider
              colSpan={"1/4"}
              rowSpan={1}
              removeFromParent={{
                parent: { name: "subject", id: subjectId },
                func: (relatedEntity) =>
                  removeRelatedEntityFromSubject({
                    relatedEntity,
                  }),
              }}
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
