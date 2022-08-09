import { Trash } from "phosphor-react";

import { SubContentType } from "^types/primary-content";

import { ContentMenuButton } from "^components/menus/Content";
import WithWarning from "^components/WithWarning";

const DeleteContentButtonUI = ({
  deleteFunc,
  docType,
}: {
  deleteFunc: () => void;
  docType: SubContentType;
}) => (
  <WithWarning
    warningText={{
      heading: `Delete ${docType}?`,
      body: `This will affect all documents this ${docType} is connected to.`,
    }}
    callbackToConfirm={deleteFunc}
  >
    <ContentMenuButton
      tooltipProps={{ text: `delete ${docType}`, type: "action" }}
    >
      <Trash />
    </ContentMenuButton>
  </WithWarning>
);

export default DeleteContentButtonUI;
