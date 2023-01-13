import tw from "twin.macro";

import { orderDisplayContent } from "^helpers/displayContent";
import { useDispatch, useSelector } from "^redux/hooks";
import { selectArticles } from "^redux/state/articles";
import { selectBlogs } from "^redux/state/blogs";
import { selectCollections } from "^redux/state/collections";
import { selectAll, populateEmptySection } from "^redux/state/landing";
import { selectRecordedEvents } from "^redux/state/recordedEvents";

// import Collections from "./auto-section/collections";
// import RecordedEvents from "./auto-section/recorded-events";
import { FirstCustomSection, SecondCustomSection } from "./custom-section";
import Collections from "^curated-pages/collection-of-documents/_components/CollectionsSwiperSection";
import RecordedEvents from "^curated-pages/collection-of-documents/_components/RecordedEventsSwiperSection";

const Document = () => {
  return (
    <div css={[tw`pt-xl`]}>
      <Sections />
    </div>
  );
};

export default Document;

const usePopulateEmptyCustomSections = () => {
  const customSectionComponents = useSelector(selectAll);

  const dispatch = useDispatch();
  const articles = useSelector(selectArticles);
  const blogs = useSelector(selectBlogs);

  if (customSectionComponents.length) {
    return;
  }

  const entities = orderDisplayContent([...articles, ...blogs]).map(
    (entity) => ({
      id: entity.id,
      type: entity.type,
    })
  );

  const firstSectionEntities = entities.slice(0, 5);
  const secondSectionEntities = entities.slice(
    5,
    entities.length < 5 ? entities.length : 4
  );

  dispatch(
    populateEmptySection({
      entities: firstSectionEntities,
      section: 0,
    })
  );
  dispatch(
    populateEmptySection({
      entities: secondSectionEntities,
      section: 1,
    })
  );
};

const Sections = () => {
  usePopulateEmptyCustomSections();

  const recordedEvents = useSelector(selectRecordedEvents);
  const collections = useSelector(selectCollections);

  return (
    <div css={[tw`pb-xl`]}>
      <FirstCustomSection />
      {!collections.length ? null : <Collections collections={collections} />}
      {!recordedEvents.length ? null : (
        <RecordedEvents recordedEvents={recordedEvents} />
      )}
      <div css={[tw`mt-lg`]}>{/* <SecondCustomSection /> */}</div>
    </div>
  );
};
