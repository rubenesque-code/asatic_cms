import { createContext, ReactElement, useContext, useState } from "react";
import {
  Check,
  FileMinus,
  Translate as TranslateIcon,
  WarningCircle,
} from "phosphor-react";
import tw from "twin.macro";

import { useSelector } from "^redux/hooks";
import { selectLanguageById } from "^redux/state/languages";

import { capitalizeFirstLetter, checkObjectHasField } from "^helpers/general";

import {
  default_language_Id,
  second_default_language_Id,
} from "^constants/data";

import WithProximityPopover from "^components/WithProximityPopover";
import WithTooltip from "^components/WithTooltip";

import s_button from "^styles/button";
import { s_popover } from "^styles/popover";
import { Language } from "^types/language";
import SubContentMissingFromStore from "./SubContentMissingFromStore";
import LanguagesInputWithSelectUnpopulated from "./languages/LanguageInputWithSelect";
import WithWarning from "./WithWarning";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function DocLanguages() {}

type SelectContextValue = [
  {
    activeLanguageId: string;
    activeLanguage: Language | undefined;
    docLanguagesIds: string[];
  },
  {
    setActiveLanguageId: (id: string) => void;
  }
];
const SelectContext = createContext<SelectContextValue>([
  {},
  {},
] as SelectContextValue);

const getInitialLanguageId = (languagesById: string[]) =>
  languagesById.includes(default_language_Id)
    ? default_language_Id
    : languagesById.includes(second_default_language_Id)
    ? second_default_language_Id
    : languagesById[0];

DocLanguages.SelectProvider = function SelectProvider({
  children,
  docLanguagesIds,
}: {
  children:
    | ReactElement
    | (({ activeLanguageId }: { activeLanguageId: string }) => ReactElement);
  docLanguagesIds: string[];
}) {
  const [activeLanguageId, setActiveLanguageId] = useState(
    getInitialLanguageId(docLanguagesIds)
  );

  const activeLanguage = useSelector((state) =>
    selectLanguageById(state, activeLanguageId)
  );

  return (
    <SelectContext.Provider
      value={[
        { activeLanguageId, activeLanguage, docLanguagesIds },
        {
          setActiveLanguageId,
        },
      ]}
    >
      {typeof children === "function"
        ? children({ activeLanguageId })
        : children}
    </SelectContext.Provider>
  );
};

DocLanguages.useSelectContext = function useDocTranslationsContext() {
  const [{ activeLanguageId, activeLanguage }] = useContext(SelectContext);
  const contextIsPopulated = activeLanguage;
  if (!contextIsPopulated) {
    throw new Error(
      "useDocTranslationsContext must be used within its provider!"
    );
  }

  return { activeLanguageId, activeLanguage };
};
function useDocTranslationsContext() {
  const context = useContext(SelectContext);
  const contextIsPopulated = checkObjectHasField(context[0]);
  if (!contextIsPopulated) {
    throw new Error(
      "useDocTranslationsContext must be used within its provider!"
    );
  }

  return context;
}

type EditContextValue = {
  addLanguageToDoc: (languageId: string) => void;
  docType: string;
  removeLanguageFromDoc: (languageId: string) => void;
};

const EditContext = createContext<EditContextValue>({} as EditContextValue);

function EditProvider({
  children,
  ...editDocLanguages
}: { children: ReactElement } & EditContextValue) {
  return (
    <EditContext.Provider value={editDocLanguages}>
      {children}
    </EditContext.Provider>
  );
}

function useEditContext() {
  const context = useContext(EditContext);
  const contextIsPopulated = checkObjectHasField(context);
  if (!contextIsPopulated) {
    throw new Error("useEditContext must be used within its provider!");
  }

  return context;
}

DocLanguages.Popover = function DocLanguagePopover(
  editProviderProps: EditContextValue
) {
  const [{ activeLanguage }] = useDocTranslationsContext();

  return (
    <WithProximityPopover
      panel={
        <EditProvider {...editProviderProps}>
          <Panel />
        </EditProvider>
      }
    >
      <LabelUI activeLanguage={activeLanguage} />
    </WithProximityPopover>
  );
};

const LabelUI = ({
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

const Panel = () => (
  <div css={[s_popover.panelContainer]}>
    <div>
      <h4 css={[s_popover.title]}>Translations</h4>
      <p css={[s_popover.explanatoryText]}>
        Choose active translation to edit. Add and remove translations.
      </p>
    </div>
    <div>
      <div css={[tw`flex flex-col gap-md items-start`]}>
        <div css={[tw`flex flex-col gap-xxs`]}>
          <Translations />
        </div>
      </div>
    </div>
    <LanguagesInputSelect />
  </div>
);

const Translations = () => {
  const [{ docLanguagesIds, activeLanguageId }, { setActiveLanguageId }] =
    useDocTranslationsContext();
  const { docType, removeLanguageFromDoc } = useEditContext();

  return (
    <>
      {docLanguagesIds.map((languageId, i) => (
        <TranslationLanguage
          canRemove={docLanguagesIds.length > 1}
          docType={docType}
          isActive={languageId === activeLanguageId}
          languageId={languageId}
          makeActive={() => setActiveLanguageId(languageId)}
          index={i}
          removeFromDoc={() => removeLanguageFromDoc(languageId)}
          key={languageId}
        />
      ))}
    </>
  );
};

type TranslationLanguageProps = {
  makeActive: () => void;
  languageId: string;
  index: number;
  removeFromDoc: () => void;
  isActive: boolean;
  canRemove: boolean;
  docType: string;
};

const TranslationLanguage = ({
  // addToDoc,
  docType,
  languageId,
  makeActive,
  index: number,
  removeFromDoc,
  canRemove,
  isActive,
}: TranslationLanguageProps) => {
  const language = useSelector((state) =>
    selectLanguageById(state, languageId)
  );
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

const LanguagesInputSelect = () => {
  const [{ docLanguagesIds }] = useDocTranslationsContext();
  const { addLanguageToDoc, docType } = useEditContext();

  return (
    <LanguagesInputWithSelectUnpopulated
      docLanguageIds={docLanguagesIds}
      docType={docType}
      onSubmit={(languageId) => addLanguageToDoc(languageId)}
    />
  );
};
