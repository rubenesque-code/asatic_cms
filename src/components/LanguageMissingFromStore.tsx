import { ReactElement, ComponentProps } from "react";
import { WarningCircle } from "phosphor-react";
import tw from "twin.macro";

import WithTooltip from "./WithTooltip";

type Placement = ComponentProps<typeof WithTooltip>["placement"];

const LanguageMissingFromStore = ({
  children,
  tooltipPlacement,
}: {
  children?: string | ReactElement;
  tooltipPlacement?: Placement;
}) => {
  return (
    <WithTooltip
      placement={tooltipPlacement}
      text={{
        header: "Language error",
        body: "This translation relates to a language that couldn't be found. Try refreshing the page.",
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
        <span css={[tw`text-red-warning`]}>
          <WarningCircle />
        </span>
      )}
    </WithTooltip>
  );
};

export default LanguageMissingFromStore;
