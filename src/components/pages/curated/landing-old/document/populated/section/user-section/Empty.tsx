import { CaretDown } from "phosphor-react";
import tw from "twin.macro";

import AddEntityPopover from "./AddEntityPopover";

const Empty = () => {
  return (
    <div css={[tw`min-h-[300px] grid place-items-center border`]}>
      <div css={[tw`flex flex-col items-center`]}>
        <p css={[tw`text-gray-600`]}>No content yet for this custom section.</p>
        <AddEntityPopover>
          <button
            css={[
              tw`mt-lg inline-flex items-center gap-xxs border rounded-md py-1.5 px-3`,
            ]}
            className="group"
            type="button"
          >
            <span css={[tw`uppercase text-xs text-gray-700`]}>
              add component
            </span>
            <span
              css={[
                tw`p-xxxs group-hover:bg-gray-50 group-active:bg-gray-100 rounded-full transition-colors duration-75 ease-in-out text-gray-500 text-xs`,
              ]}
            >
              <CaretDown />
            </span>
          </button>
        </AddEntityPopover>
      </div>
    </div>
  );
};

export default Empty;
