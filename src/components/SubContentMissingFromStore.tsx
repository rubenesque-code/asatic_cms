import { ReactElement, ComponentProps } from "react";
import { WarningCircle } from "phosphor-react";
import tw from "twin.macro";

import WithTooltip from "./WithTooltip";

type Placement = ComponentProps<typeof WithTooltip>["placement"];

const SubContentMissingFromStore = ({
  children,
  subContentType,
  tooltipPlacement,
}: {
  children?: string | ReactElement;
  subContentType: string;
  tooltipPlacement?: Placement;
}) => {
  return (
    <WithTooltip
      placement={tooltipPlacement}
      text={{
        header: `${subContentType} error`,
        body: `The ${subContentType} referenced couldn't be found. Try refreshing the page.`,
      }}
    >
      {children ? (
        <div css={[tw`flex gap-xs items-center text-red-warning`]}>
          <span>{children}</span>
          <span>
            <WarningCircle />
          </span>
        </div>
      ) : (
        <span css={[tw`grid place-items-center text-red-warning`]}>
          <WarningCircle weight="bold" />
        </span>
      )}
    </WithTooltip>
  );
};

export default SubContentMissingFromStore;
