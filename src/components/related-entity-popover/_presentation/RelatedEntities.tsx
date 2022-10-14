import tw from "twin.macro";
import { ReactElement, cloneElement } from "react";

import SubContentMissingFromStore from "^components/SubContentMissingFromStore";
import { MissingIcon } from "^components/Icons";
import WithTooltip from "^components/WithTooltip";

import { $TranslationDivider } from "../_styles/relatedEntities";

export const $MissingEntity = ({ entityType }: { entityType: string }) => {
  return (
    <div css={[tw`inline-block`]}>
      <SubContentMissingFromStore subContentType={entityType}>
        Error
      </SubContentMissingFromStore>
    </div>
  );
};

export const $Entity = ({
  activeTranslations,
  inactiveTranslations,
}: {
  activeTranslations: ReactElement[];
  inactiveTranslations: ReactElement[];
}) => (
  <div css={[tw`flex items-center gap-xs`]}>
    <div css={[tw`w-[3px] flex-shrink-0 self-stretch bg-green-200`]} />
    <div css={[tw`flex items-center gap-sm`]}>
      {activeTranslations.map((child, i) => (
        <div css={[tw`flex gap-sm items-baseline`]} key={i}>
          {i !== 0 ? <$TranslationDivider /> : null}
          {cloneElement(child)}
        </div>
      ))}
      {inactiveTranslations.length
        ? inactiveTranslations.map((child, i) => (
            <div css={[tw`flex gap-sm items-baseline`]} key={i}>
              <$TranslationDivider />
              {cloneElement(child)}
            </div>
          ))
        : null}
    </div>
  </div>
);

export const $MissingTranslationText = () => {
  return (
    <WithTooltip text="missing translation">
      <div css={[tw`flex items-baseline gap-xxxs w-full justify-center`]}>
        <span css={[tw`text-gray-placeholder`]}>...</span>
        <span css={[tw`text-red-500 translate-y-0.5`]}>
          <MissingIcon />
        </span>
      </div>
    </WithTooltip>
  );
};
