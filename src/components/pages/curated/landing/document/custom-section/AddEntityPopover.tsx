import { ReactElement } from "react";

import { useSelector } from "^redux/hooks";
import { selectAll } from "^redux/state/landing";
import { addOne } from "^redux/state/landing";

import { ArticleLikeEntityPopover_ } from "^components/rich-popover";
import { LandingCustomSectionComponent } from "^types/landing";

const useSelectEntityIdsInCustomSections = () => {
  const customSectionComponents = useSelector(selectAll);

  const articles = customSectionComponents
    .flatMap((c) => (c.entity.type === "article" ? [c] : []))
    .map((c) => c.entity.id);
  const blogs = customSectionComponents
    .flatMap((c) => (c.entity.type === "blog" ? [c] : []))
    .map((c) => c.entity.id);

  return { articles, blogs };
};

const AddEntityPopover = ({
  children: button,
  section,
}: {
  children: ReactElement;
  section: LandingCustomSectionComponent["section"];
}) => {
  const usedEntities = useSelectEntityIdsInCustomSections();

  return (
    <ArticleLikeEntityPopover_
      parentEntity={{
        actions: {
          addEntity: (entity) =>
            addOne({
              entity: { id: entity.id, type: entity.name },
              section,
            }),
        },
        data: {
          existingEntitiesIds: usedEntities,
          name: "landing",
        },
      }}
    >
      {button}
    </ArticleLikeEntityPopover_>
  );
};

export default AddEntityPopover;
