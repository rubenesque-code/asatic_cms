import { ReactElement } from "react";
import { Funnel } from "phosphor-react";
import tw from "twin.macro";

const FiltersUI = ({
  search,
  languageSelect,
}: {
  languageSelect: ReactElement;
  search: ReactElement;
}) => (
  <div css={[tw`flex flex-col gap-sm`]}>
    <h3 css={[tw`font-medium text-xl flex items-center gap-xs`]}>
      <span>
        <Funnel />
      </span>
      <span>Filters</span>
    </h3>
    <div css={[tw`flex flex-col gap-xs`]}>
      {search}
      <div>{languageSelect}</div>
    </div>
  </div>
);

export default FiltersUI;
