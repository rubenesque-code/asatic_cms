import { Translate as TranslateIcon } from "phosphor-react";
import tw from "twin.macro";
import WithTooltip from "^components/WithTooltip";

const MissingTranslation = ({
  tooltipText = "missing translation",
}: {
  tooltipText?: string;
}) => {
  return (
    <WithTooltip text={tooltipText} placement="top">
      <span css={[tw`flex items-center gap-xxxs text-red-warning text-xs`]}>
        <span>!</span>
        <TranslateIcon />
      </span>
    </WithTooltip>
  );
};

export default MissingTranslation;
