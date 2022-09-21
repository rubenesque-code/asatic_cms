import { Trash } from "phosphor-react";

import { ContentMenuButton } from "^components/menus/Content";
import WithWarning from "^components/WithWarning";

const DeleteSectionButtonUI = ({ onClick }: { onClick: () => void }) => (
  <WithWarning
    callbackToConfirm={onClick}
    warningText={{ heading: "Delete section?" }}
  >
    <ContentMenuButton
      tooltipProps={{ text: "delete section", type: "action" }}
    >
      <Trash />
    </ContentMenuButton>
  </WithWarning>
);

export default DeleteSectionButtonUI;
