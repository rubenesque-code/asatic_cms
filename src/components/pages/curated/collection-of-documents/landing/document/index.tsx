import tw from "twin.macro";

import { orderDisplayContent } from "^helpers/displayContent";
import { useSelector } from "^redux/hooks";
import { selectArticlesByIds } from "^redux/state/articles";
import { selectBlogsByIds } from "^redux/state/blogs";
import { selectCollections } from "^redux/state/collections";
import { selectAll as selectLandingCustomSectionComponents } from "^redux/state/landing";
import { selectRecordedEvents } from "^redux/state/recordedEvents";

// import Collections from "./auto-section/collections";
// import RecordedEvents from "./auto-section/recorded-events";
import { FirstCustomSection, SecondCustomSection } from "./custom-section";
import CollectionsSwiperSection from "^curated-pages/collection-of-documents/_components/CollectionsSwiperSection";
import RecordedEventsSwiperSection from "^curated-pages/collection-of-documents/_components/RecordedEventsSwiperSection";

import { $MissingChildDocuments_ } from "^curated-pages/collection-of-documents/_presentation";
import { mapIds } from "^helpers/general";

const Document = () => {
  return (
    <div css={[tw`pt-xl`]}>
      <Sections />
    </div>
  );
};

export default Document;

const Sections = () => {
  const customSectionComponents = useSelector(
    selectLandingCustomSectionComponents
  );
  const articleIds = customSectionComponents.flatMap((component) =>
    component.entity.type === "article" ? [component.entity.id] : []
  );
  const blogIds = customSectionComponents.flatMap((component) =>
    component.entity.type === "blog" ? [component.entity.id] : []
  );

  const { articles, blogs } = useSelector((state) => ({
    articles: {
      all: selectArticlesByIds(state, articleIds),
      get found() {
        return this.all.flatMap((e) => (e ? [e] : []));
      },
      get numMissing() {
        return this.all.filter((e) => e === undefined).length;
      },
    },
    blogs: {
      all: selectBlogsByIds(state, blogIds),
      get found() {
        return this.all.flatMap((e) => (e ? [e] : []));
      },
      get numMissing() {
        return this.all.filter((e) => e === undefined).length;
      },
    },
  }));

  const entitiesOrdered = orderDisplayContent([
    ...articles.found,
    ...blogs.found,
  ]);
  const componentsProcessed = [
    ...mapIds(entitiesOrdered).map(
      (entityId) =>
        customSectionComponents.find(
          (component) => component.entity.id === entityId
        )!
    ),
  ];

  // usePopulateEmptyCustomSections();

  const firstSectionComponents = componentsProcessed
    .filter((component) => component.section === 0)
    .sort((a, b) => a.index - b.index);

  const secondSectionComponents = componentsProcessed
    .filter((component) => component.section === 1)
    .sort((a, b) => a.index - b.index);

  const recordedEvents = useSelector(selectRecordedEvents);
  const collections = useSelector(selectCollections);

  return (
    <div css={[tw`pb-xl`]}>
      <$MissingChildDocuments_
        articles={articles.numMissing}
        blogs={blogs.numMissing}
      />
      <FirstCustomSection components={firstSectionComponents} />
      {!collections.length ? null : (
        <CollectionsSwiperSection collections={collections} />
      )}
      {!recordedEvents.length ? null : (
        <RecordedEventsSwiperSection recordedEvents={recordedEvents} />
      )}
      <div css={[tw`mt-lg`]}>
        <SecondCustomSection components={secondSectionComponents} />
      </div>
    </div>
  );
};
