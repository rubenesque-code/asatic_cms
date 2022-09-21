import { CaretDown, PlusCircle, SquaresFour } from "phosphor-react";
import tw from "twin.macro";
import { useSelector } from "^redux/hooks";

import { selectTotal as selectTotalLandingSections } from "^redux/state/landing";
import AddLandingSectionPopover from "./add-section-popover";
// import Sections from "./Sections";

const Body = () => {
  const numSections = useSelector(selectTotalLandingSections);

  return numSections ? <div>HEllo</div> : <SectionsEmpty />;
};

export default Body;

function SectionsEmpty() {
  return (
    <div css={[tw`text-center`]}>
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
