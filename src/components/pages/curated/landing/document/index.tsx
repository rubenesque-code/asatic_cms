import tw from "twin.macro";

import { orderDisplayContent } from "^helpers/displayContent";
import { useDispatch, useSelector } from "^redux/hooks";
import { selectArticles } from "^redux/state/articles";
import { selectBlogs } from "^redux/state/blogs";
import { selectTotalCollections } from "^redux/state/collections";
import { selectAll, populateEmptySection } from "^redux/state/landing";
import { selectTotalRecordedEvents } from "^redux/state/recordedEvents";

import Collections from "./auto-section/collections";
import RecordedEvents from "./auto-section/recorded-events";
import { FirstCustomSection, SecondCustomSection } from "./custom-section";

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
  const secondSectionEntities = entities.slice(5, entities.length);

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

  const numRecordedEvents = useSelector(selectTotalRecordedEvents);
  const numCollections = useSelector(selectTotalCollections);

  return (
    <div>
      <FirstCustomSection />
      {!numCollections ? null : <Collections />}
      {!numRecordedEvents ? null : <RecordedEvents />}
      <SecondCustomSection />
    </div>
  );
};
