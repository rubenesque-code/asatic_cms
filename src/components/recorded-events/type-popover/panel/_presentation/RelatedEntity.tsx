import tw from "twin.macro";
import { ReactElement, cloneElement } from "react";

import SubContentMissingFromStore from "^components/SubContentMissingFromStore";
import { MissingIcon } from "^components/Icons";
import WithTooltip from "^components/WithTooltip";

import {
  $AllTranslations,
  $TranslationsInactive,
  $Divider,
  $Translations as $Translations_,
} from "../_styles/relatedEntity";

export const $MissingEntity = ({ entityType }: { entityType: string }) => {
  return (
    <div css={[tw`inline-block`]}>
      <SubContentMissingFromStore subContentType={entityType}>
        Error
      </SubContentMissingFromStore>
    </div>
  );
};

export const $FoundEntity = ({
  activeTranslations,
  inactiveTranslations,
}: {
  activeTranslations: ReactElement[];
  inactiveTranslations: ReactElement[];
}) => (
  <div css={[tw`flex items-center gap-xs`]}>
    <div css={[tw`w-xxs h-[16px] bg-gray-200`]} />
    <$AllTranslations>
      <$Translations>{activeTranslations}</$Translations>
      <$TranslationsInactive>
        <$Divider />
        <$Translations>{inactiveTranslations}</$Translations>
      </$TranslationsInactive>
    </$AllTranslations>
  </div>
);

export const $Translations = ({ children }: { children: ReactElement[] }) => {
  return (
    <$Translations_>
      {children.map((child, i) => (
        <>
          {i !== 0 ? <$Divider /> : null}
          {cloneElement(child, { ...child.props })}
        </>
      ))}
    </$Translations_>
  );
};

export const $MissingTranslation = () => {
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
