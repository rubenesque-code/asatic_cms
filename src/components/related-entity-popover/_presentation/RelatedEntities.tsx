import tw from "twin.macro";
import { ReactElement, cloneElement } from "react";

import SubContentMissingFromStore from "^components/SubContentMissingFromStore";
import { MissingIcon, RemoveRelatedEntityIcon } from "^components/Icons";
import WithTooltip from "^components/WithTooltip";

import { $TranslationDivider } from "../_styles/relatedEntities";
import s_transition from "^styles/transition";

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
  removeFromParent,
}: {
  activeTranslations: ReactElement[];
  inactiveTranslations?: ReactElement[];
  removeFromParent?: {
    func: () => void;
    entityType: string;
    parentType: string;
  };
}) => (
  <div css={[tw`flex items-center gap-xs`]} className="group">
    <div css={[tw`w-[3px] flex-shrink-0 self-stretch bg-green-200`]} />
    <div
      css={[
        tw`relative flex items-center gap-sm`,
        removeFromParent &&
          tw`translate-x-0 group-hover:translate-x-5 transition-transform delay-75 ease-in`,
      ]}
    >
      {removeFromParent ? (
        <WithTooltip
          text={`remove ${removeFromParent.entityType} from ${removeFromParent.parentType}`}
          type="action"
        >
          <button
            css={[
              s_transition.onGroupHover,
              tw`absolute -left-xxs -translate-x-full top-1/2 -translate-y-1/2 transition-all ease-in overflow-visible`,
              tw`rounded-full p-1 hover:bg-gray-100`,
            ]}
            onClick={removeFromParent.func}
          >
            <span css={[tw`text-red-warning text-sm`]}>
              <RemoveRelatedEntityIcon />
            </span>
          </button>
        </WithTooltip>
      ) : null}
      {activeTranslations.map((child, i) => (
        <div css={[tw`flex gap-sm items-baseline`]} key={i}>
          {i !== 0 ? <$TranslationDivider /> : null}
          {cloneElement(child)}
        </div>
      ))}
      {inactiveTranslations?.length
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
