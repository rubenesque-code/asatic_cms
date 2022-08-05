import { PencilSimple } from "phosphor-react";
import tw from "twin.macro";
import WithTooltip from "^components/WithTooltip";

const MissingText = ({ tooltipText }: { tooltipText: string }) => {
  return (
    <WithTooltip text={tooltipText} placement="top">
      <span
        css={[
          tw`group-hover:z-50 flex items-center gap-xxxs text-red-warning text-xs`,
        ]}
      >
        <span css={[tw`text-gray-400`]}>...</span>
        <span>!</span>
        <PencilSimple />
      </span>
    </WithTooltip>
  );
};

export default MissingText;
