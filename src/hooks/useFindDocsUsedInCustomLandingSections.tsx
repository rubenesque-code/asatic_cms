import { useSelector } from "^redux/hooks";
import { selectAll } from "^redux/state/landing";

import { LandingSectionCustomComponent } from "^types/landing";

const useFindDocsUsedInCustomLandingSections = (
  docType: LandingSectionCustomComponent["type"]
) => {
  const landingSections = useSelector(selectAll);
  const landingCustomSections = landingSections.flatMap((s) =>
    s.type === "custom" ? [s] : []
  );
  const customSectionsArticlesIds = landingCustomSections
    .flatMap((s) => s.components)
    .flatMap((c) => (c.type === docType ? [c] : []))
    .map((c) => c.docId);

  return customSectionsArticlesIds;
};

export default useFindDocsUsedInCustomLandingSections;
