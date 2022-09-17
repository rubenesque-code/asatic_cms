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
      <span css={[tw`text-red-warning text-xs`]}>
        <TranslateIcon />
      </span>
    </WithTooltip>
  );
};

export default MissingTranslation;
