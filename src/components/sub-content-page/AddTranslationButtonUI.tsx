import { Plus as PlusIcon } from "phosphor-react";

import { ContentMenuButton } from "^components/menus/Content";

const AddTranslationButtonUI = () => (
  <ContentMenuButton tooltipProps={{ text: "add translation" }}>
    <PlusIcon />
  </ContentMenuButton>
);

export default AddTranslationButtonUI;
