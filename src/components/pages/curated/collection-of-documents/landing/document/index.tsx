import tw from "twin.macro";

import { orderDisplayContent } from "^helpers/displayContent";
import { useSelector } from "^redux/hooks";
import { selectCollections } from "^redux/state/collections";
import { selectAll as selectLandingCustomSectionComponents } from "^redux/state/landing";
import { selectRecordedEvents } from "^redux/state/recordedEvents";

import { FirstCustomSection, SecondCustomSection } from "./custom-section";
import CollectionsSwiperSection from "^curated-pages/collection-of-documents/_components/CollectionsSwiperSection";
import RecordedEventsSwiperSection from "^curated-pages/collection-of-documents/_components/RecordedEventsSwiperSection";

import { $MissingChildDocuments_ } from "^curated-pages/collection-of-documents/_presentation";
import { arrayDivergence, mapIds, mapLanguageIds } from "^helpers/general";
import { LandingCustomSectionComponent } from "^types/landing";
import SiteLanguage from "^components/SiteLanguage";
import {
  selectArticlesByIdsAndLanguageId,
  selectArticlesByLanguage,
} from "^redux/state/complex-selectors/article";
import {
  selectBlogsByIdsAndLanguageId,
  selectBlogsByLanguage,
} from "^redux/state/complex-selectors/blogs";

const Document = () => {
  return (
    <div css={[tw`pt-xl`]}>
      <Sections />
    </div>
  );
};

export default Document;

const Sections = () => {
  const siteLanguage = SiteLanguage.useContext();
  console.log("siteLanguage:", siteLanguage);

  const { missingEntities, sections } = useGetCustomSectionComponents({
    siteLanguageId: siteLanguage.id,
  });

  const isAvailableContentForEmptySecondSection =
    useDetermineIsAvailableContentForEmptySecondSection({
      firstSectionComponents: sections.first,
    });

  return (
    <div css={[tw`pb-xl`]}>
      <$MissingChildDocuments_
        articles={missingEntities.articles}
        blogs={missingEntities.blogs}
      />
      <FirstCustomSection components={sections.first} />
      <Collections />
      <RecordedEvents />
      {!isAvailableContentForEmptySecondSection ? null : (
        <div css={[tw`mt-lg`]}>
          <SecondCustomSection components={sections.second} />
        </div>
      )}
    </div>
  );
};

const Collections = () => {
  const siteLanguage = SiteLanguage.useContext();

  const collections = useSelector(selectCollections).filter(
    (collection) => collection.languageId === siteLanguage.id
  );

  if (!collections.length) {
    return null;
  }

  return <CollectionsSwiperSection collections={collections} />;
};

const RecordedEvents = () => {
  const siteLanguage = SiteLanguage.useContext();

  const recordedEvents = useSelector(selectRecordedEvents).filter((re) =>
    mapLanguageIds(re.translations).includes(siteLanguage.id)
  );

  if (!recordedEvents.length) {
    return null;
  }

  return (
    <RecordedEventsSwiperSection
      recordedEvents={recordedEvents}
      parentLanguageId={siteLanguage.id}
    />
  );
};

const useGetCustomSectionComponents = ({
  siteLanguageId,
}: {
  siteLanguageId: "english" | "tamil";
}) => {
  const customSectionComponents = useSelector(
    selectLandingCustomSectionComponents
  ).filter((component) => component.languageId === siteLanguageId);

  const articleIds = customSectionComponents.flatMap((component) =>
    component.entity.type === "article" ? [component.entity.id] : []
  );
  const blogIds = customSectionComponents.flatMap((component) =>
    component.entity.type === "blog" ? [component.entity.id] : []
  );

  const { articles, blogs } = useSelector((state) => ({
    articles: selectArticlesByIdsAndLanguageId(state, {
      ids: articleIds,
      languageId: siteLanguageId,
    }),
    blogs: selectBlogsByIdsAndLanguageId(state, {
      ids: blogIds,
      languageId: siteLanguageId,
    }),
  }));

  const entitiesOrdered = orderDisplayContent([
    ...articles.valid,
    ...blogs.valid,
  ]);
  const componentsProcessed = [
    ...mapIds(entitiesOrdered).map(
      (entityId) =>
        customSectionComponents.find(
          (component) => component.entity.id === entityId
        )!
    ),
  ];

  const firstSectionComponents = componentsProcessed
    .filter(
      (component) =>
        component.section === 0 && component.languageId === siteLanguageId
    )
    .sort((a, b) => a.index - b.index);
  console.log("firstSectionComponents:", firstSectionComponents);

  const secondSectionComponents = componentsProcessed
    .filter(
      (component) =>
        component.section === 1 && component.languageId === siteLanguageId
    )
    .sort((a, b) => a.index - b.index);

  return {
    sections: {
      first: firstSectionComponents,
      second: secondSectionComponents,
    },
    missingEntities: {
      articles: articles.numMissing,
      blogs: blogs.numMissing,
    },
  };
};

const useDetermineIsAvailableContentForEmptySecondSection = ({
  firstSectionComponents,
}: {
  firstSectionComponents: LandingCustomSectionComponent[];
}) => {
  const siteLanguage = SiteLanguage.useContext();

  const firstSectionEntityIds = firstSectionComponents
    .filter((component) => component.languageId === siteLanguage.id)
    .map((component) => component.entity.id);

  const allArticleIds = useSelector((state) =>
    mapIds(selectArticlesByLanguage(state, { languageId: siteLanguage.id }))
  );
  const allBlogIds = useSelector((state) =>
    mapIds(selectBlogsByLanguage(state, { languageId: siteLanguage.id }))
  );

  const isAvailableContentForSecondSection = arrayDivergence(
    [...allArticleIds, ...allBlogIds],
    firstSectionEntityIds
  ).length;

  return isAvailableContentForSecondSection;
};
