import { PencilSimple } from "phosphor-react";
import { ReactElement } from "react";
import tw, { TwStyle } from "twin.macro";
import WithTooltip from "^components/WithTooltip";

const MissingText = ({
  tooltipText,
  fontSize = tw`text-xs`,
  children,
}: {
  tooltipText: string;
  fontSize?: TwStyle;
  children?: ReactElement;
}) => {
  return (
    <WithTooltip text={tooltipText} placement="top">
      <span
        css={[
          tw`group-hover:z-50 flex items-center gap-xxxs text-red-warning`,
          fontSize,
        ]}
      >
        {/* <span css={[tw`text-gray-400`]}>...</span> */}
        {children ? children : null}
        <span>!</span>
        <PencilSimple />
      </span>
    </WithTooltip>
  );
};

export default MissingText;
