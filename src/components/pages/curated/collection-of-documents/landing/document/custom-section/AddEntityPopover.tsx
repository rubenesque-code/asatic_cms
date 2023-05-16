import { ReactElement } from "react";
import { toast } from "react-toastify";

import { useDispatch, useSelector } from "^redux/hooks";
import { selectAll } from "^redux/state/landing";
import { addOne } from "^redux/state/landing";

import { ArticleLikeEntityPopover_ } from "^components/rich-popover";
import { LandingCustomSectionComponent } from "^types/landing";
import SiteLanguage from "^components/SiteLanguage";

const useSelectEntityIdsInCustomSectionsForSiteLanguage = () => {
  const siteLanguage = SiteLanguage.useContext();

  const usedCustomSectionComponentsForSiteLanguage = useSelector(
    selectAll
  ).filter((component) => component.languageId === siteLanguage.id);

  const articles = usedCustomSectionComponentsForSiteLanguage
    .flatMap((c) => (c.entity.type === "article" ? [c] : []))
    .map((c) => c.entity.id);
  const blogs = usedCustomSectionComponentsForSiteLanguage
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
  const usedEntities = useSelectEntityIdsInCustomSectionsForSiteLanguage();
  const dispatch = useDispatch();
  const siteLanguage = SiteLanguage.useContext();

  return (
    <ArticleLikeEntityPopover_
      parentEntity={{
        actions: {
          addEntity: (entity) => {
            dispatch(
              addOne({
                entity: { id: entity.id, type: entity.name },
                section,
                languageId: siteLanguage.id,
              })
            );
            toast.success("Added");
          },
        },
        data: {
          existingEntitiesIds: usedEntities,
          name: "landing",
          limitToLanguageId: siteLanguage.id,
        },
      }}
    >
      {button}
    </ArticleLikeEntityPopover_>
  );
};

export default AddEntityPopover;
