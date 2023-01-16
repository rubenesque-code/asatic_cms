import { ReactElement } from "react";
import tw from "twin.macro";

import {
  RemoveRelatedEntityIcon,
  MoveDownIcon,
  MoveUpIcon,
} from "^components/Icons";
import ContentMenu from "^components/menus/Content";

export type $SectionMenuProps = {
  children?: ReactElement | (ReactElement | null)[];
  isShowing: boolean;
  sectionIndex: number;
  numSections: number;
  moveSectionUp: () => void;
  moveSectionDown: () => void;
  removeSection: () => void;
};

export const $SectionMenu_ = ({
  children: extraButtons,
  isShowing,
  sectionIndex,
  numSections,
  moveSectionDown,
  moveSectionUp,
  removeSection,
}: $SectionMenuProps) => {
  const canMoveDown = sectionIndex < numSections - 1;
  const canMoveUp = sectionIndex > 0;

  return (
    <ContentMenu styles={tw`top-0 right-0`} show={isShowing}>
      <>
        {extraButtons ? (
          <>
            {extraButtons}
            <ContentMenu.VerticalBar />
          </>
        ) : null}
        <ContentMenu.Button
          isDisabled={!canMoveDown}
          onClick={moveSectionDown}
          tooltipProps={{ text: "move section down", type: "action" }}
        >
          <MoveDownIcon />
        </ContentMenu.Button>
        <ContentMenu.Button
          isDisabled={!canMoveUp}
          onClick={moveSectionUp}
          tooltipProps={{ text: "move section up", type: "action" }}
        >
          <MoveUpIcon />
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
          <RemoveRelatedEntityIcon />
        </ContentMenu.ButtonWithWarning>
      </>
    </ContentMenu>
  );
};
