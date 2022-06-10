import { WarningCircle } from "phosphor-react";
import { ReactElement, ComponentProps } from "react";
import tw from "twin.macro";
import WithTooltip from "./WithTooltip";

type Placement = ComponentProps<typeof WithTooltip>["placement"];

const LanguageError = ({
  children,
  tooltipPlacement,
}: {
  children: string | ReactElement;
  tooltipPlacement?: Placement;
}) => {
  return (
    <WithTooltip
      placement={tooltipPlacement}
      text={{
        header: "Language error",
        body: "Language not found. Try refreshing the page. Otherwise, try editing the language from the 'edit languages' panel.",
      }}
    >
      <div css={[tw`flex gap-xs items-center text-red-warning`]}>
        <span>{children}</span>
        <span>
          <WarningCircle />
        </span>
      </div>
    </WithTooltip>
  );
};

export default LanguageError;
