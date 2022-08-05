import { Plus } from "phosphor-react";
import tw from "twin.macro";

import { useSelector } from "^redux/hooks";

import { selectAll as selectAllLanguages } from "^redux/state/languages";

import WithProximityPopover from "./WithProximityPopover";
import WithTooltip from "./WithTooltip";
import AddNewLanguage from "./AddNewLanguage";

// * this exists in the (article) translations panel as well as add author

// * should have a generic basic type of 'translation' that can be extended
type Translation<T> = T & { languageId: string };

function AddTranslation<T>({
  onAddTranslation,
  parentDataType = "",
  translations,
}: {
  onAddTranslation: (languageId: string) => void;
  parentDataType?: string;
  translations: Translation<T>[];
}) {
  return (
    <WithProximityPopover
      panel={({ close }) => (
        <AddTranslationPanel
          closePanel={close}
          onAddTranslation={onAddTranslation}
          parentDataType={parentDataType}
          translations={translations}
        />
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
}

export default AddTranslation;

function AddTranslationPanel<T>({
  closePanel,
  onAddTranslation,
  parentDataType,
  translations,
}: {
  closePanel: () => void;
  onAddTranslation: (languageId: string) => void;
  parentDataType: string;
  translations: Translation<T>[];
}) {
  const languages = useSelector(selectAllLanguages);

  const usedLanguageIds = translations.map((t) => t.languageId);

  const handleAddTranslation = (languageId: string) => {
    onAddTranslation(languageId);
    closePanel();
  };

  return (
    <div css={[tw`p-lg min-w-[35ch] flex flex-col gap-sm`]}>
      <h3 css={[tw`text-xl font-medium`]}>Add {parentDataType} translation</h3>
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
}
