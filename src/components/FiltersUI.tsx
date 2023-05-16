import { ReactElement } from "react";
import { Funnel as FunnelIcon } from "phosphor-react";
import tw from "twin.macro";

const FiltersUI = ({
  children,
  marginLeft = true,
}: {
  children: ReactElement;
  marginLeft?: boolean;
}) => (
  <div css={[marginLeft && tw`ml-xl`]}>
    <div css={[tw`flex flex-col gap-sm`]}>
      <h3 css={[tw`font-medium text-xl flex items-center gap-xs`]}>
        <span>
          <FunnelIcon />
        </span>
        <span>Filters</span>
      </h3>
      <div css={[tw`flex flex-col gap-xxs items-start`]}>{children}</div>
    </div>
  </div>
);

export default FiltersUI;
