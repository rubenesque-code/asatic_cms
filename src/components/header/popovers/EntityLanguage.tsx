import tw from "twin.macro";
import { TranslateIcon } from "^components/Icons";

import {
  EntityLanguagePopover,
  EntityLanguagePopoverButton,
  ParentEntityProp,
} from "^components/rich-popover/entity-languages";
import SubContentMissingFromStore from "^components/SubContentMissingFromStore";
import WithTooltip from "^components/WithTooltip";
import s_button from "^styles/button";

export const HeaderEntityLanugagePopover_ = ({
  parentEntity,
}: ParentEntityProp) => (
  <EntityLanguagePopover parentEntity={parentEntity}>
    <Button />
  </EntityLanguagePopover>
);

const Button = () => (
  <EntityLanguagePopoverButton>
    {(activeLanguage) => (
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
    )}
  </EntityLanguagePopoverButton>
);
