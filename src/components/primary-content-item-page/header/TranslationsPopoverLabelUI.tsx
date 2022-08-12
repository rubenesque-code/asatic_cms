import { Translate as TranslateIcon } from "phosphor-react";
import tw from "twin.macro";

import { Language } from "^types/language";

import WithTooltip from "^components/WithTooltip";

import s_button from "^styles/button";
import SubContentMissingFromStore from "^components/SubContentMissingFromStore";

const TranslationsPopoverLabelUI = ({
  activeLanguage,
}: {
  activeLanguage: Language | undefined;
}) => (
  <WithTooltip text="translations" placement="right">
    <button css={[tw`flex gap-xxxs items-center`]}>
      <span css={[s_button.subIcon, tw`text-sm -translate-y-1`]}>
        <TranslateIcon />
      </span>
      {activeLanguage ? (
        <span css={[tw`text-sm`]}>{activeLanguage.name}</span>
      ) : (
        <SubContentMissingFromStore
          subContentType="language"
          tooltipPlacement="bottom"
        />
      )}
    </button>
  </WithTooltip>
);

export default TranslationsPopoverLabelUI;
