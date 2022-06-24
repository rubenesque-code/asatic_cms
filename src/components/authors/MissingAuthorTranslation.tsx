import { PencilSimple } from "phosphor-react";
import tw from "twin.macro";
import WithTooltip from "^components/WithTooltip";

const MissingAuthorTranslation = () => {
  return (
    <WithTooltip text="Missing author translation" placement="top">
      <span
        css={[
          tw`group-hover:z-50 flex items-center gap-xxxs text-red-warning text-xs`,
          // tw`group-hover:z-50 flex items-center gap-xxxs absolute right-0 top-1/2 -translate-y-1/2 text-red-warning text-xs`,
        ]}
      >
        <span>!</span>
        <PencilSimple />
      </span>
    </WithTooltip>
  );
};

export default MissingAuthorTranslation;
