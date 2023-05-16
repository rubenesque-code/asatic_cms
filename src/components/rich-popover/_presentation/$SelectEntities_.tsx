import { Fragment, ReactElement } from "react";
import tw from "twin.macro";

import { AddRelatedEntityIcon } from "^components/Icons";
import WithTooltip from "^components/WithTooltip";
import { $TranslationDivider } from "^components/rich-popover/_styles/selectEntities";
import s_transition from "^styles/transition";

export const $SelectEntity_ = ({
  addEntityToParent,
  children: translations,
  entityType,
  parentType,
  addToParentText,
}: {
  addEntityToParent: () => void;
  children: ReactElement[];
  entityType: string;
  parentType: string;
  addToParentText?: string;
}) => (
  <div
    css={[tw`flex items-center gap-sm w-[94%] flex-nowrap`]}
    className="group"
  >
    <div css={[tw`w-[2px] flex-shrink-0 self-stretch bg-gray-200`]} />
    <WithTooltip
      text={
        addToParentText ? addToParentText : `Add ${entityType} to ${parentType}`
      }
      type="action"
    >
      <div
        css={[
          tw`relative flex items-center gap-sm w-full flex-nowrap cursor-pointer`,
          tw`translate-x-0 group-hover:translate-x-4 transition-transform delay-75 ease-in`,
        ]}
        onClick={addEntityToParent}
      >
        <div
          css={[
            s_transition.onGroupHover,
            tw`absolute -left-xs -translate-x-full top-1/2 -translate-y-1/2 transition-all ease-in`,
          ]}
        >
          <span css={[tw`text-green-active`]}>
            <AddRelatedEntityIcon />
          </span>
        </div>
        {
          <div css={[tw`flex items-center gap-sm`]}>
            {translations.map((translation, i) => (
              <Fragment key={translation.key}>
                {i !== 0 ? <$TranslationDivider /> : null}
                {translation}
              </Fragment>
            ))}
          </div>
        }
      </div>
    </WithTooltip>
  </div>
);

/* export const $Entity = ({ translations }: { translations: ReactElement[] }) => (
  <div css={[tw`flex items-center gap-sm`]}>
    {translations.map((translation, i) => (
      <Fragment key={translation.key}>
        {i !== 0 ? <$TranslationDivider /> : null}
        {translation}
      </Fragment>
    ))}
  </div>
);
 */
