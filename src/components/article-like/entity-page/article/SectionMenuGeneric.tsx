import { ArrowDown, ArrowUp, Trash } from "phosphor-react";
import { ReactElement } from "react";
import tw from "twin.macro";

import ContentMenu from "^components/menus/Content";

const SectionMenuGeneric = ({
  children: extraButtons,
  isShowing,
  sectionIndex,
  numSections,
  moveSectionDown,
  moveSectionUp,
  removeSection,
}: {
  children?: ReactElement;
  isShowing: boolean;
  sectionIndex: number;
  numSections: number;
  moveSectionUp: () => void;
  moveSectionDown: () => void;
  removeSection: () => void;
}) => {
  const canMoveDown = sectionIndex < numSections - 1;
  const canMoveUp = sectionIndex > 0;

  return (
    <ContentMenu styles={tw`top-0 right-0`} show={isShowing}>
      <>
        {extraButtons}
        <ContentMenu.Button
          isDisabled={!canMoveDown}
          onClick={moveSectionDown}
          tooltipProps={{ text: "move section down", type: "action" }}
        >
          <ArrowDown />
        </ContentMenu.Button>
        <ContentMenu.Button
          isDisabled={!canMoveUp}
          onClick={moveSectionUp}
          tooltipProps={{ text: "move section up", type: "action" }}
        >
          <ArrowUp />
        </ContentMenu.Button>
        <ContentMenu.VerticalBar />
        <ContentMenu.ButtonWithWarning
          warningProps={{
            callbackToConfirm: removeSection,
            warningText: "delete section?",
            type: "moderate",
          }}
          tooltipProps={{ text: "delete section", type: "action" }}
        >
          <Trash />
        </ContentMenu.ButtonWithWarning>
      </>
    </ContentMenu>
  );
};

export default SectionMenuGeneric;
