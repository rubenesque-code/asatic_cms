import { Fragment } from "react";
import tw from "twin.macro";

import RecordedEventTypeSlice from "^context/recorded-event-types/RecordedEventTypeContext";
import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";

import { RecordedEventTypeTranslation } from "^types/recordedEvent";

import { TranslationLanguage_ } from "^components/_containers/TranslationLanguage";
import { AddRelatedEntityIcon } from "^components/Icons";
import WithTooltip from "^components/WithTooltip";

import { $TranslationDivider } from "^components/related-entity-popover/_styles/selectEntities";

import s_transition from "^styles/transition";

const Item = () => {
  const [, { updateType }] = RecordedEventSlice.useContext();
  const [{ id: typeId }] = RecordedEventTypeSlice.useContext();

  return (
    <div
      css={[tw`flex items-center gap-sm w-full flex-nowrap`]}
      className="group"
    >
      <div css={[tw`w-[2px] flex-shrink-0 self-stretch bg-gray-200`]} />
      <WithTooltip text="update video type" type="action">
        <div
          css={[
            tw`flex items-center gap-sm w-full flex-nowrap cursor-pointer`,
            tw`translate-x-0 group-hover:translate-x-4 transition-transform delay-75 ease-in`,
          ]}
          onClick={() => updateType({ typeId })}
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
          <RecordedEventType />
        </div>
      </WithTooltip>
    </div>
  );
};

export default Item;

const RecordedEventType = () => {
  const [{ translations }] = RecordedEventTypeSlice.useContext();

  const processed = translations.filter((t) => t.name.length);

  return (
    <div css={[tw`flex items-center gap-sm`]}>
      {processed.map((translation, i) => (
        <Fragment key={translation.id}>
          {i !== 0 ? <$TranslationDivider /> : null}
          <Translation translation={translation} />
        </Fragment>
      ))}
    </div>
  );
};

const Translation = ({
  translation,
}: {
  translation: RecordedEventTypeTranslation;
}) => {
  return (
    <div css={[tw`flex flex-nowrap`]}>
      <p css={[tw`text-gray-700 mr-xs whitespace-nowrap`]}>
        {translation.name}
      </p>
      <TranslationLanguage_ languageId={translation.languageId} />
    </div>
  );
};
