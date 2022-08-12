import { ReactElement } from "react";
import tw from "twin.macro";
import { Translate } from "phosphor-react";

import { useSelector } from "^redux/hooks";
import { selectById as selectLanguageById } from "^redux/state/languages";

import { Language } from "^types/language";

import SubContentMissingFromStore from "./SubContentMissingFromStore";
import WithProximityPopover from "./WithProximityPopover";
import MissingText from "./MissingText";

import { s_popover } from "^styles/popover";
import { RecordedEvent } from "^types/recordedEvent";

const WithRelatedRecordedEvents = ({
  recordedEvents: recordedEvents,
  children,
  ...panelUIProps
}: {
  recordedEvents: RecordedEvent[];
  children: ReactElement;
} & PanelUIPropsPassedFromTop) => {
  return (
    <WithProximityPopover
      panel={<Panel recordedEvents={recordedEvents} {...panelUIProps} />}
      panelMaxWidth={tw`max-w-[90vw]`}
    >
      {children}
    </WithProximityPopover>
  );
};

export default WithRelatedRecordedEvents;

const Panel = ({
  recordedEvents: recordedEvents,
  ...panelUIProps
}: {
  recordedEvents: RecordedEvent[];
} & PanelUIPropsPassedFromTop) => {
  return (
    <PanelUI
      list={
        <ListUI>
          <>
            {recordedEvents.map((recordedEvent, i) => (
              <RecordedEventUI
                recordedEvent={
                  <>
                    {recordedEvent.translations.map((translation, i) => (
                      <RecordedEventTranslation
                        isFirst={i === 0}
                        translation={translation}
                        key={translation.id}
                      />
                    ))}
                  </>
                }
                listNum={i + 1}
                key={recordedEvent.id}
              />
            ))}
          </>
        </ListUI>
      }
      isRecordedEvent={Boolean(recordedEvents.length)}
      {...panelUIProps}
    />
  );
};

type PanelUIPropsPassedFromTop = {
  title: string;
  subTitleText: {
    noRecordedEvents: string;
    withRecordedEvents: string;
  };
};

const PanelUI = ({
  list: list,
  isRecordedEvent: isRecordedEvent,
  title,
  subTitleText,
}: PanelUIPropsPassedFromTop & {
  list: ReactElement;
  isRecordedEvent: boolean;
}) => {
  return (
    <div css={[s_popover.panelContainer, tw`w-[90ch]`]}>
      <div>
        <h4 css={[s_popover.title, tw`text-base`]}>{title}</h4>
        <p css={[tw`text-gray-600 text-sm mt-xxs`]}>
          {!isRecordedEvent
            ? subTitleText.noRecordedEvents
            : subTitleText.withRecordedEvents}
        </p>
      </div>
      <div>{list}</div>
    </div>
  );
};

const ListUI = ({ children }: { children: ReactElement }) => {
  return <div css={[tw`mt-xs flex flex-col gap-sm`]}>{children}</div>;
};

const RecordedEventUI = ({
  recordedEvent: recordedEvent,
  listNum,
}: {
  recordedEvent: ReactElement;
  listNum: number;
}) => {
  return (
    <div css={[tw`flex gap-xs`]}>
      <div css={[tw`text-gray-600`]}>{listNum}.</div>
      <div css={[tw`flex-grow flex items-center gap-sm flex-wrap`]}>
        {recordedEvent}
        <div css={[tw`flex items-center gap-xxs`]}>
          <div css={[tw`h-[20px] w-[0.5px] bg-gray-300`]} />
          <div css={[tw`h-[20px] w-[0.5px] bg-gray-300`]} />
        </div>
      </div>
    </div>
  );
};

const RecordedEventTranslation = ({
  isFirst,
  translation,
}: {
  isFirst: boolean;
  translation: RecordedEvent["translations"][number];
}) => {
  const { languageId, title } = translation;

  const language = useSelector((state) =>
    selectLanguageById(state, languageId)
  );

  return (
    <TranslationUI
      isFirst={isFirst}
      language={<LanguageUI language={language} />}
      title={title}
    />
  );
};

const TranslationUI = ({
  isFirst,
  title,
  language,
}: {
  isFirst: boolean;
  title: string | undefined;
  language: ReactElement;
}) => {
  return (
    <div css={[tw`flex items-center gap-sm`]} className="group">
      {!isFirst ? <div css={[tw`h-[20px] w-[0.5px] bg-gray-200`]} /> : null}
      <div css={[tw`flex gap-xs`]}>
        {title ? title : <MissingText tooltipText="missing title" />}
        <p css={[tw`flex gap-xxxs items-center`]}>
          <span css={[tw`text-xs -translate-y-1 text-gray-500`]}>
            <Translate />
          </span>
          {language}
        </p>
      </div>
    </div>
  );
};

const LanguageUI = ({ language }: { language: Language | undefined }) => {
  return language ? (
    <span css={[tw`capitalize text-gray-600 text-sm`]}>{language.name}</span>
  ) : (
    <SubContentMissingFromStore subContentType="language" />
  );
};
