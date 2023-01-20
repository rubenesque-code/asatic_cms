import { FilePlus } from "phosphor-react";
import { $Cell } from "^components/display-entities-table/styles";
import ContentMenu from "^components/menus/Content";

export const ActionsCell = ({
  addToDocument,
}: {
  addToDocument: () => void;
}) => {
  return (
    <$Cell>
      <ContentMenu.Button
        onClick={addToDocument}
        tooltipProps={{ text: "add to document" }}
      >
        <FilePlus />
      </ContentMenu.Button>
    </$Cell>
  );
};
