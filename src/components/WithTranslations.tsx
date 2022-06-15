import { FormEvent, ReactElement, useState } from "react";
import tw from "twin.macro";
import {
  Check,
  FileMinus,
  FilePlus,
  Plus,
  WarningCircle,
  Prohibit,
} from "phosphor-react";

import { capitalizeFirstLetter, fuzzySearch } from "^helpers/general";

import { useDispatch, useSelector } from "^redux/hooks";
import {
  addOne,
  selectAll,
  selectById,
  selectEntitiesByIds,
} from "^redux/state/languages";

import useFocused from "^hooks/useFocused";

import { Translation } from "^types/editable_content";

import WithProximityPopover from "./WithProximityPopover";
import WithTooltip from "./WithTooltip";
import WithWarning from "./WithWarning";

import { s_menu } from "^styles/menus";
import { s_popover } from "^styles/popover";
import s_transition from "^styles/transition";

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
  makeActive: (id: string) => void;
  translations: T[];
  removeFromDoc: (id: string) => void;
  addToDoc: (languageId: string) => void;
  activeTranslationId: string;
} & TranslationLanguagePassedProps;

function Panel<T extends Translation>({
  addToDoc,
  docType,
  makeActive,
  removeFromDoc,
  translations,
  activeTranslationId,
}: PanelProps<T>) {
  return (
    <div css={[s_popover.container]}>
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
                makeActive={() => makeActive(id)}
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

const inputId = "languages-input";

type LanguagesInputWithSelectProps = {
  docLanguageIds: string[];
  docType: string;
  onSubmit: (languageId: string) => void;
};

const LanguagesInputWithSelect = ({
  docLanguageIds,
  onSubmit,
  docType,
}: LanguagesInputWithSelectProps) => {
  const [inputValue, setInputValue] = useState("");

  const [inputIsFocused, focusHandlers] = useFocused();

  const allLanguages = useSelector(selectAll);
  const docLanguages = useSelector((state) =>
    selectEntitiesByIds(state, docLanguageIds)
  );
  const docLanguagesText = docLanguages.map((l) => l?.name);

  const inputValueIsDocLanguage = docLanguagesText.includes(inputValue);

  const dispatch = useDispatch();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (inputValueIsDocLanguage) {
      return;
    }

    const existingLanguage = allLanguages.find((t) => t.name === inputValue);

    if (existingLanguage) {
      onSubmit(existingLanguage.id);
    } else {
      // * want value to be stored in a default format e.g. in order to compare a query against existing values easier
      const valueFormatted = inputValue.toLowerCase();
      dispatch(addOne({ name: valueFormatted }));
      setInputValue("");
      const languageId = valueFormatted;
      onSubmit(languageId);
    }
  };

  return (
    <div css={[tw`relative inline-block self-start`]} {...focusHandlers}>
      <form onSubmit={handleSubmit}>
        <div css={[tw`relative`]}>
          <input
            css={[
              tw`text-gray-800 px-lg py-1 text-sm outline-none border-2 border-transparent focus:border-gray-200 rounded-sm`,
              !inputIsFocused && tw`text-gray-400`,
            ]}
            id={inputId}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Add a new translation..."
            type="text"
            autoComplete="off"
          />
          <label
            css={[
              tw`absolute left-2 top-1/2 -translate-y-1/2 text-gray-500`,
              !inputIsFocused && tw`text-gray-300`,
            ]}
            htmlFor={inputId}
          >
            <Plus />
          </label>
          {inputValueIsDocLanguage ? (
            <WithTooltip text="A translation with this language name is already connected to this document">
              <span
                css={[
                  tw`absolute top-1/2 -translate-y-1/2 right-2 text-red-warning`,
                  !inputIsFocused && tw`text-gray-300`,
                ]}
              >
                <Prohibit />
              </span>
            </WithTooltip>
          ) : null}
        </div>
      </form>
      <LanguagesSelect
        docLanguageIds={docLanguageIds}
        docType={docType}
        onSubmit={(languageId) => {
          setInputValue("");
          onSubmit(languageId);
        }}
        query={inputValue}
        show={inputIsFocused && inputValue.length > 1}
      />
    </div>
  );
};

const LanguagesSelect = ({
  docLanguageIds,
  docType,
  onSubmit,
  query,
  show,
}: LanguagesInputWithSelectProps & { query: string; show: boolean }) => {
  const allLanguages = useSelector(selectAll);

  const languagesMatchingQuery = fuzzySearch(["name"], allLanguages, query).map(
    (f) => f.item
  );

  return (
    <div
      css={[
        tw`absolute -bottom-2 translate-y-full w-full bg-white border-2 border-gray-200 rounded-sm py-sm text-sm shadow-lg`,
        show ? tw`opacity-100` : tw`opacity-0 h-0`,
        tw`transition-opacity duration-75 ease-linear`,
      ]}
    >
      {languagesMatchingQuery.length ? (
        <div css={[tw`flex flex-col gap-xs items-start`]}>
          {languagesMatchingQuery.map((language) => {
            const isDocLanguage = docLanguageIds.includes(language.id);
            const languageNameFormatted = capitalizeFirstLetter(language.name);

            return (
              <WithTooltip
                text={`add translation to ${docType}`}
                isDisabled={isDocLanguage}
                key={language.id}
              >
                <button
                  css={[
                    !isDocLanguage
                      ? s_menu.listItemText
                      : tw`text-gray-400 cursor-auto`,
                    tw`text-left py-1 relative w-full px-sm transition-opacity ease-in-out duration-75`,
                  ]}
                  className="group"
                  onClick={() => {
                    if (isDocLanguage) {
                      return;
                    }
                    onSubmit(language.id);
                  }}
                  type="button"
                >
                  <span>{languageNameFormatted}</span>
                  {!isDocLanguage ? (
                    <span
                      css={[
                        s_transition.onGroupHover,
                        tw`absolute right-2 top-1/2 -translate-y-1/2 text-green-600`,
                      ]}
                    >
                      <FilePlus />
                    </span>
                  ) : null}
                </button>
              </WithTooltip>
            );
          })}
        </div>
      ) : (
        <p css={[tw`text-gray-600 ml-sm`]}>No matches</p>
      )}
    </div>
  );
};
