import { ReactElement } from "react";

import LandingCustomSectionContext from "^context/landing/LandingCustomSectionContext";

import PrimaryEntityPopover_ from "^components/rich-popover/primary-entity";
import { useSelector } from "^redux/hooks";
import { selectAll as selectLandingSections } from "^redux/state/landing";
import tw from "twin.macro";

const useSelectEntitiesInCustomSections = () => {
  const userSections = useSelector(selectLandingSections).flatMap((s) =>
    s.type === "custom" ? [s] : []
  );
  const usedEntities = userSections.flatMap((s) => s.components);
  const articles = usedEntities
    .flatMap((c) => (c.type === "article" ? [c] : []))
    .map((c) => c.docId);
  const blogs = usedEntities
    .flatMap((c) => (c.type === "blog" ? [c] : []))
    .map((c) => c.docId);
  const recordedEvents = usedEntities
    .flatMap((c) => (c.type === "recorded-event" ? [c] : []))
    .map((c) => c.docId);

  return { articles, blogs, recordedEvents };
};

const PrimaryEntityPopover = ({
  children: button,
}: {
  children: ReactElement;
}) => {
  const [, { addComponentToCustom }] = LandingCustomSectionContext.useContext();

  const usedEntities = useSelectEntitiesInCustomSections();

  return (
    <PrimaryEntityPopover_
      containerStyles={tw`w-[700px] max-w-[96vw]`}
      parentActions={{
        addArticleToParent: (docId) =>
          addComponentToCustom({ docId, type: "article" }),
        addBlogToParent: (docId) =>
          addComponentToCustom({ docId, type: "blog" }),
        addRecordedEventToParent: (docId) =>
          addComponentToCustom({ docId, type: "recorded-event" }),
      }}
      parentData={{
        excludedEntities: usedEntities,
        parentType: "user-created section",
      }}
    >
      {button}
    </PrimaryEntityPopover_>
  );
};

export default PrimaryEntityPopover;
