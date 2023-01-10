import { ReactElement } from "react";

import { useSelector } from "^redux/hooks";
import { selectAll as selectLandingSections } from "^redux/state/landing";
import LandingCustomSectionContext from "^context/landing/LandingCustomSectionContext";

import { ArticleLikeEntityPopover_ } from "^components/rich-popover";

const useSelectEntitiesInCustomSections = () => {
  const userSections = useSelector(selectLandingSections).flatMap((s) =>
    s.type === "user" ? [s] : []
  );
  const usedEntities = userSections.flatMap((s) => s.components);
  const articles = usedEntities
    .flatMap((c) => (c.entity.type === "article" ? [c] : []))
    .map((c) => c.entity.id);
  const blogs = usedEntities
    .flatMap((c) => (c.entity.type === "blog" ? [c] : []))
    .map((c) => c.entity.id);

  return { articles, blogs };
};

const EntityPopover = ({ children: button }: { children: ReactElement }) => {
  const [, { addComponentToUserSection }] =
    LandingCustomSectionContext.useContext();

  const usedEntities = useSelectEntitiesInCustomSections();

  return (
    <ArticleLikeEntityPopover_
      parentEntity={{
        actions: {
          addPrimaryEntity: (primaryEntity) =>
            addComponentToUserSection({
              componentEntity: {
                id: primaryEntity.id,
                type: primaryEntity.name,
              },
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

export default EntityPopover;
