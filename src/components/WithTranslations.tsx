import { ReactElement } from "react";
import tw from "twin.macro";
import { Check, FileMinus, WarningCircle } from "phosphor-react";

import { capitalizeFirstLetter } from "^helpers/general";

import { useSelector } from "^redux/hooks";
import { selectById } from "^redux/state/languages";

import { Translation } from "^types/editable_content";

import WithProximityPopover from "./WithProximityPopover";
import WithTooltip from "./WithTooltip";
import WithWarning from "./WithWarning";
import LanguagesInputWithSelect from "./languages/LanguageInputWithSelect";

import { s_popover } from "^styles/popover";

type Props<T extends Translation> = {
  children: ReactElement;
} & PanelProps<T>;

function WithTranslations<T extends Translation>({
  children,
  ...panelProps
}: Props<T>) {
  return (
    <WithProximityPopover panelContentElement={<Panel {...panelProps} />}>
      {children}
    </WithProximityPopover>
  );
}

export default WithTranslations;

type PanelProps<T extends Translation> = {
  updateActiveTranslation: (languageId: string) => void;
  translations: T[];
  removeFromDoc: (id: string) => void;
  addToDoc: (languageId: string) => void;
  activeTranslationId: string;
} & TranslationLanguagePassedProps;

function Panel<T extends Translation>({
  addToDoc,
  docType,
  updateActiveTranslation,
  removeFromDoc,
  translations,
  activeTranslationId,
}: PanelProps<T>) {
  return (
    <div css={[s_popover.panelContainer]}>
      <div>
        <h4 css={[s_popover.title]}>Translations</h4>
        <p css={[s_popover.subTitleText]}>
          Choose active translation to edit. Add and remove translations.
        </p>
      </div>
      <div>
        <div css={[tw`flex flex-col gap-md items-start`]}>
          <div css={[tw`flex flex-col gap-xxs`]}>
            {translations.map(({ id, languageId }, i) => (
              <TranslationLanguage
                isActive={id === activeTranslationId}
                languageId={languageId}
                makeActive={() => updateActiveTranslation(languageId)}
                number={i}
                removeFromDoc={() => removeFromDoc(id)}
                docType={docType}
                canRemove={translations.length > 1}
                key={id}
              />
            ))}
          </div>
        </div>
      </div>
      <LanguagesInputWithSelect
        docLanguageIds={translations.map((t) => t.languageId)}
        docType={docType}
        onSubmit={(languageId) => addToDoc(languageId)}
      />
    </div>
  );
}

type TranslationLanguagePassedProps = {
  docType: string;
};

type TranslationLanguageProps = {
  makeActive: () => void;
  languageId: string;
  number: number;
  removeFromDoc: () => void;
  isActive: boolean;
  canRemove: boolean;
} & TranslationLanguagePassedProps;

const TranslationLanguage = ({
  // addToDoc,
  docType,
  languageId,
  makeActive,
  number,
  removeFromDoc,
  canRemove,
  isActive,
}: TranslationLanguageProps) => {
  const language = useSelector((state) => selectById(state, languageId));
  const languageNameFormatted = language
    ? capitalizeFirstLetter(language.name)
    : null;

  // todo: tooltip with more info

  return (
    <div
      css={[tw`relative flex items-center`]}
      className="group"
      key={languageId}
    >
      <span css={[tw`text-gray-600 w-[25px]`]}>{number + 1}.</span>
      {language ? (
        <WithTooltip
          text="make translation active in the editor"
          type="action"
          placement="top"
          isDisabled={isActive}
        >
          <button
            css={[
              tw`flex gap-sm items-center`,
              isActive && tw`pointer-events-none`,
            ]}
            className="group"
            onClick={() => !isActive && makeActive()}
            type="button"
          >
            <span css={[tw`text-gray-700 hover:text-gray-900`]}>
              {languageNameFormatted}
            </span>
            <span
              css={[
                tw`invisible opacity-0`,
                tw`group-hover:visible group-hover:opacity-100 transition-opacity ease-in duration-75 text-gray-300`,
                isActive && tw`visible opacity-100 text-green-400`,
              ]}
            >
              <Check />
            </span>
          </button>
        </WithTooltip>
      ) : (
        <WithTooltip
          text={{
            header: "Language error",
            body: "Language not found. Try refreshing the page. Otherwise, try editing the language from the 'edit languages' panel.",
          }}
        >
          <div css={[tw`flex gap-sm items-center text-red-warning`]}>
            <span>Language error</span>
            <span>
              <WarningCircle />
            </span>
          </div>
        </WithTooltip>
      )}
      {canRemove ? (
        <WithWarning
          callbackToConfirm={() => removeFromDoc()}
          warningText={`Remove ${
            language ? languageNameFormatted : ""
          } translation from ${docType}?`}
          type="moderate"
        >
          {({ isOpen: warningIsOpen }) => (
            <WithTooltip
              text={`remove 
               translation from ${docType}`}
              placement="top"
              type="action"
              isDisabled={warningIsOpen}
            >
              <button
                css={[
                  tw`group-hover:visible group-hover:opacity-100 invisible opacity-0 transition-opacity ease-in-out duration-75`,
                  tw`ml-lg`,
                  tw`text-gray-400 p-xxs hover:bg-gray-100 hover:text-red-warning active:bg-gray-200 rounded-full grid place-items-center`,
                ]}
                type="button"
              >
                <FileMinus />
              </button>
            </WithTooltip>
          )}
        </WithWarning>
      ) : null}
    </div>
  );
};
