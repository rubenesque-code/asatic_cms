import { CaretDown } from "phosphor-react";
import tw from "twin.macro";
import { AutomaticPopulateIcon } from "^components/Icons";
import SiteLanguage from "^components/SiteLanguage";
import { usePopulateLandingWithLatest } from "^hooks/landing/usePopulateLandingWithLatest";

import AddEntityPopover from "./AddEntityPopover";

const Empty = ({ section }: { section: 0 | 1 }) => {
  const siteLanguage = SiteLanguage.useContext();

  const populateWithLatest = usePopulateLandingWithLatest();

  return (
    <div css={[tw`min-h-[300px] grid place-items-center border`]}>
      <div css={[tw`flex flex-col items-center`]}>
        <p css={[tw`text-gray-600`]}>
          {section === 0 ? "First" : "Second"} article/blog section. No{" "}
          <span css={[tw`font-medium`]}>{siteLanguage.name}</span> content yet.
        </p>
        <AddEntityPopover section={section}>
          <div
            css={[
              tw`mt-lg inline-flex items-center gap-xxs border rounded-md py-1.5 px-3`,
            ]}
            className="group"
          >
            <span css={[tw`uppercase text-xs text-gray-700`]}>
              add document
            </span>
            <span
              css={[
                tw`p-xxxs group-hover:bg-gray-50 group-active:bg-gray-100 rounded-full transition-colors duration-75 ease-in-out text-gray-500 text-xs`,
              ]}
            >
              <CaretDown />
            </span>
          </div>
        </AddEntityPopover>
        <p css={[tw`text-gray-500 mt-sm uppercase text-xs`]}>or</p>
        <button
          css={[
            tw`mt-sm inline-flex items-center gap-sm border rounded-md py-1.5 px-3`,
          ]}
          className="group"
          onClick={populateWithLatest}
          type="button"
        >
          <span css={[tw`uppercase text-xs text-gray-700`]}>
            populate page with latest {siteLanguage.name} documents
          </span>
          <span
            css={[
              tw`text-gray-800 group-hover:text-green-600 transition-colors ease-in-out`,
            ]}
          >
            <AutomaticPopulateIcon />
          </span>
        </button>
      </div>
    </div>
  );
};

export default Empty;
