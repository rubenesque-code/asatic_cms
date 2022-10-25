import { PlusCircle } from "phosphor-react";
import tw from "twin.macro";

import WithTooltip from "^components/WithTooltip";

import AddLandingSectionPopover from "../add-section-popover";

import s_transition from "^styles/transition";

function AddSectionMenu({
  newSectionIndex,
  adjacentSectionIsHovered,
}: {
  newSectionIndex: number;
  adjacentSectionIsHovered: boolean;
}) {
  return (
    <div
      css={[
        tw`relative z-30 hover:z-40 h-[10px]`,
        s_transition.toggleVisiblity(adjacentSectionIsHovered),
        tw`opacity-40 hover:visible hover:opacity-100`,
      ]}
    >
      <div
        css={[tw`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`]}
      >
        <AddLandingSectionPopover newSectionIndex={newSectionIndex}>
          <WithTooltip text="add section here" type="action">
            <button
              css={[
                tw`rounded-full bg-transparent hover:bg-white text-gray-400 hover:scale-125 transition-all ease-in duration-75 hover:text-green-active`,
              ]}
              type="button"
            >
              <PlusCircle />
            </button>
          </WithTooltip>
        </AddLandingSectionPopover>
      </div>
    </div>
  );
}

export default AddSectionMenu;
