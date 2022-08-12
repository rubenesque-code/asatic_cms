import { ReactElement } from "react";
import { Funnel as FunnelIcon } from "phosphor-react";
import tw from "twin.macro";

const FiltersUI = ({
  languageSelect,
  search,
}: {
  search: ReactElement;
  languageSelect: ReactElement;
}) => (
  <div css={[tw`ml-xl `]}>
    <div css={[tw`flex flex-col gap-sm`]}>
      <h3 css={[tw`font-medium text-xl flex items-center gap-xs`]}>
        <span>
          <FunnelIcon />
        </span>
        <span>Filters</span>
      </h3>
      <div css={[tw`flex flex-col gap-xxs items-start`]}>
        {search}
        {languageSelect}
      </div>
    </div>
  </div>
);

export default FiltersUI;
