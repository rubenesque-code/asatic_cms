import { createContext, ReactElement, useContext } from "react";
import tw from "twin.macro";
import { Plus, Trash, WarningCircle } from "phosphor-react";

import { useSelector } from "^redux/hooks";

import {
  selectById as selectLanguageById,
  selectAll as selectAllLanguages,
} from "^redux/state/languages";

import useHovered from "^hooks/useHovered";

import { UseDocTranslationContext } from "^context/DocTranslationContext";

import WithTooltip from "^components/WithTooltip";
import WithWarning from "^components/WithWarning";
import WithProximityPopover from "^components/WithProximityPopover";
import AddNewLanguage from "^components/AddNewLanguage";

// todo: might be better if only show controls once tab is active: a bit visually confusing when scrolling over tabs and controls flashing in and out

type DeleteTranslationProp = {
  deleteTranslation: (translationId: string) => void;
};
type AddTranslationProp = {
  addTranslation: (languageId: string) => void;
};

type ContextValue = ReturnType<UseDocTranslationContext> &
  DeleteTranslationProp &
  AddTranslationProp;

function createPassTranslationContext() {
  const Context = createContext<ContextValue>({} as ContextValue);

  const DocTranslationProvider = ({
    addTranslation,
    children,
    deleteTranslation,
    useDocTranslationContext,
  }: {
    children: ReactElement;
    useDocTranslationContext: UseDocTranslationContext;
  } & DeleteTranslationProp &
    AddTranslationProp) => {
    return (
      <Context.Provider
        value={{
          ...useDocTranslationContext(),
          deleteTranslation,
          addTranslation,
        }}
      >
        {children}
      </Context.Provider>
    );
  };

  const useDocTranslationContext = () => {
    const context = useContext(Context);
    if (context === undefined) {
      throw new Error(
        "useDocTranslationContext must be used within its provider!"
      );
    }
    return context;
  };

  return {
    DocTranslationProvider,
    useDocTranslationContext,
  };
}

const { DocTranslationProvider, useDocTranslationContext } =
  createPassTranslationContext();

const TranslationsPanel = ({
  addTranslation,
  deleteTranslation,
  useDocTranslationContext,
}: {
  useDocTranslationContext: UseDocTranslationContext;
} & DeleteTranslationProp &
  AddTranslationProp) => {
  return (
    <DocTranslationProvider
      addTranslation={addTranslation}
      deleteTranslation={deleteTranslation}
      useDocTranslationContext={useDocTranslationContext}
    >
      <div css={[s_panel]}>
        <TranslationsTabs />
        <AddTranslationPopover />
      </div>
    </DocTranslationProvider>
  );
};

const s_panel = tw`self-start flex items-center`;

export default TranslationsPanel;

function TranslationsTabs() {
  const { translations } = useDocTranslationContext();

  return (
    <>
      {translations.map((translation) => {
        return (
          <TranslationTab
            languageId={translation.languageId}
            translationId={translation.id}
            key={translation.id}
          />
        );
      })}
    </>
  );
}

const TranslationTab = ({
  languageId,
  translationId,
}: {
  languageId: string;
  translationId: string;
}) => {
  const [tabIsHovered, hoveredHandlers] = useHovered();

  const { activeTranslation, setActiveTranslationId } =
    useDocTranslationContext();
  const isActive = activeTranslation.id === translationId;

  const language = useSelector((state) =>
    selectLanguageById(state, languageId)
  );
  const noLanguageErrStr = "error";
  const languageStr = language ? language.name : noLanguageErrStr;

  return (
    <div
      css={[s_tab.tab, isActive ? s_tab.active : s_tab.inactive]}
      {...hoveredHandlers}
    >
      <div
        css={[s_tab.textContainer]}
        onClick={() => setActiveTranslationId(translationId)}
      >
        <p css={[s_tab.text]}>{languageStr}</p>
        {!language ? (
          <WithTooltip text="Language error. Possibly doesn't exist. Try refreshing the page">
            <span css={[tw`text-red-warning`]}>
              <WarningCircle />
            </span>
          </WithTooltip>
        ) : null}
      </div>
      <TranslationTabControls
        languageName={language?.name}
        show={tabIsHovered}
        translationId={translationId}
      />
    </div>
  );
};

const s_tab = {
  tab: tw`rounded-t-md  font-medium py-xxs px-md flex gap-sm select-none`,
  active: tw`bg-white shadow-lg`,
  inactive: tw`text-gray-400 cursor-pointer`,
  textContainer: tw`flex gap-xs items-center`,
  text: tw`capitalize`,
};

const TranslationTabControls = ({
  languageName,
  show,
  translationId,
}: {
  languageName: string | undefined;
  show: boolean;
  translationId: string;
}) => {
  const { translations, deleteTranslation } = useDocTranslationContext();

  const canDeleteTranslation = translations.length > 1;

  return (
    <div css={[tw`grid place-items-center`, !show && tw`hidden`]}>
      <WithWarning
        callbackToConfirm={() => deleteTranslation(translationId)}
        disabled={!canDeleteTranslation}
        warningText={{
          heading: `Delete ${languageName || ""} translation?`,
        }}
      >
        <WithTooltip
          text={
            canDeleteTranslation
              ? "delete translation"
              : "can't delete - must have at least 1 translation"
          }
          yOffset={10}
        >
          <button
            css={[
              tw`text-sm grid place-items-center px-xxs rounded-full hover:bg-gray-100 active:bg-gray-200`,
              !canDeleteTranslation && tw`opacity-30 cursor-default`,
            ]}
            type="button"
          >
            <Trash />
          </button>
        </WithTooltip>
      </WithWarning>
    </div>
  );
};

const AddTranslationPopover = () => {
  return (
    <WithProximityPopover
      panelContentElement={({ close }) => (
        <AddTranslationPanel closePanel={close} />
      )}
    >
      <div css={[tw`grid place-items-center px-sm`]}>
        <WithTooltip text="add translation" yOffset={10}>
          <button
            css={[tw`p-xxs rounded-full hover:bg-gray-100 active:bg-gray-200`]}
            type="button"
          >
            <Plus weight="bold" />
          </button>
        </WithTooltip>
      </div>
    </WithProximityPopover>
  );
};

const AddTranslationPanel = ({ closePanel }: { closePanel: () => void }) => {
  const { translations, addTranslation } = useDocTranslationContext();

  const languages = useSelector(selectAllLanguages);
  const usedLanguageIds = translations.map(
    (translation) => translation.languageId
  );

  const handleAddTranslation = (languageId: string) => {
    addTranslation(languageId);
    closePanel();
  };

  return (
    <div css={[tw`p-lg min-w-[35ch] flex flex-col gap-sm`]}>
      <h3 css={[tw`text-xl font-medium`]}>Add translation</h3>
      <div>
        <h4 css={[tw`font-medium mb-sm`]}>Existing languages</h4>
        {languages.length ? (
          <div css={[tw`flex gap-xs items-center`]}>
            {languages.map((language) => {
              const isAlreadyUsed = usedLanguageIds.includes(language.id);
              return (
                <WithTooltip
                  text={
                    isAlreadyUsed
                      ? `can't add: translation already exists in this language`
                      : `click to add ${language.name} translation`
                  }
                  key={language.id}
                >
                  <button
                    css={[
                      tw`rounded-lg border py-xxs px-xs`,
                      isAlreadyUsed && tw`opacity-30 cursor-auto`,
                    ]}
                    onClick={() =>
                      !isAlreadyUsed && handleAddTranslation(language.id)
                    }
                    type="button"
                  >
                    {language.name}
                  </button>
                </WithTooltip>
              );
            })}
          </div>
        ) : (
          <p>- none yet -</p>
        )}
      </div>
      <AddNewLanguage
        onAddNewLanguage={(languageId) => {
          handleAddTranslation(languageId);
        }}
      />
    </div>
  );
};
