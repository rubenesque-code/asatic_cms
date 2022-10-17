import { ReactElement } from "react";
import tw from "twin.macro";

import { TranslateIcon } from "^components/Icons";
import WithTooltip from "^components/WithTooltip";

import $IconButton_ from "../_presentation/$IconButton_";

const $RelatedEntityButton_ = ({
  children: icon,
  errors,
}: {
  children: ReactElement;
  errors: ("missing entity" | "missing translation")[] | null;
}) => {
  const isMissingEntity = errors?.includes("missing entity");
  const isMissingTranslation = errors?.includes("missing translation");

  return (
    <div css={[tw`relative`]}>
      <$IconButton_ tooltip="collections">{icon}</$IconButton_>
      {errors?.length ? (
        <WithTooltip
          text={
            isMissingEntity && isMissingTranslation
              ? "missing entity(s) & missing translation(s)"
              : isMissingEntity
              ? "missing entity"
              : "missing translation"
          }
        >
          <div
            css={[
              tw`z-40 absolute top-0 right-0 translate-x-2 -translate-y-0.5 scale-90 flex items-center gap-xxxs`,
            ]}
          >
            {isMissingEntity ? <MissingEntityIcon /> : null}
            {isMissingTranslation ? <MissingTranslationIcon /> : null}
          </div>
        </WithTooltip>
      ) : null}
    </div>
  );
};

export default $RelatedEntityButton_;

const MissingEntityIcon = () => {
  return <span css={[tw`text-red-warning text-xs`]}>!</span>;
};

const MissingTranslationIcon = () => {
  return (
    <span css={[tw`text-red-warning text-xs`]}>
      <TranslateIcon />
    </span>
  );
};
