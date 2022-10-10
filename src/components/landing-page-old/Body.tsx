import { Fragment, useState } from "react";
import { CaretDown, PlusCircle, SquaresFour } from "phosphor-react";
import tw from "twin.macro";
import ContainerUtility from "^components/ContainerUtilities";
import WithTooltip from "^components/WithTooltip";

import { useSelector } from "^redux/hooks";
import {
  selectIds,
  selectTotal as selectTotalLandingSections,
} from "^redux/state/landing";
import s_transition from "^styles/transition";

import AddLandingSectionPopover from "./add-section-popover";
import LandingSection from "./Section";

const LandingPageBody = () => {
  const numSections = useSelector(selectTotalLandingSections);

  return numSections ? <Content /> : <NoContent />;
};

export default LandingPageBody;

function NoContent() {
  return (
    <div css={[tw`text-center mt-md`]}>
      <div css={[tw` relative text-gray-300 inline-flex items-center`]}>
        <span css={[tw`text-4xl`]}>
          <SquaresFour weight="thin" />
        </span>
        <span css={[tw`absolute bottom-0.5 right-0.5 bg-white`]}>
          <PlusCircle />
        </span>
      </div>
      <p css={[tw`mt-sm text-gray-600`]}>
        Get started building the landing page.
      </p>
      <AddLandingSectionPopover newSectionIndex={0}>
        <AddLandingSectionPopover.Button>
          <button
            css={[
              tw`mt-lg inline-flex items-center gap-xxs border rounded-md py-1.5 px-3`,
            ]}
            className="group"
            type="button"
          >
            <span css={[tw`uppercase text-xs text-gray-700`]}>add section</span>
            <span
              css={[
                tw`p-xxxs group-hover:bg-gray-50 group-active:bg-gray-100 rounded-full transition-colors duration-75 ease-in-out text-gray-500 text-xs`,
              ]}
            >
              <CaretDown />
            </span>
          </button>
        </AddLandingSectionPopover.Button>
      </AddLandingSectionPopover>
    </div>
  );
}

const Content = () => {
  const [sectionHoveredIndex, setSectionHoveredIndex] = useState<number | null>(
    null
  );

  const sectionIds = useSelector(selectIds) as string[];

  return (
    <div css={[tw`mt-lg`]}>
      <AddSectionMenu
        newSectionIndex={0}
        adjacentSectionIsHovered={sectionHoveredIndex === 0}
      />
      {sectionIds.map((sectionId, i) => (
        <Fragment key={sectionId}>
          <ContainerUtility.onHover
            onMouseEnter={() => setSectionHoveredIndex(i)}
            onMouseLeave={() => setSectionHoveredIndex(null)}
          >
            <LandingSection id={sectionId} />
          </ContainerUtility.onHover>
          <AddSectionMenu
            adjacentSectionIsHovered={
              sectionHoveredIndex === i || sectionHoveredIndex === i + 1
            }
            newSectionIndex={i + 1}
          />
        </Fragment>
      ))}
    </div>
  );
};

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
          <AddLandingSectionPopover.Button>
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
          </AddLandingSectionPopover.Button>
        </AddLandingSectionPopover>
      </div>
    </div>
  );
}
