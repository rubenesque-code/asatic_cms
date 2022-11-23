import { FormEvent, useState } from "react";
import tw from "twin.macro";
import { FilePlus, Plus, Prohibit } from "phosphor-react";

import { capitalizeFirstLetter, fuzzySearch } from "^helpers/general";

import { useDispatch, useSelector } from "^redux/hooks";
import {
  addOne,
  selectLanguages,
  selectLanguagesByIds,
} from "^redux/state/languages";

import useFocused from "^hooks/useFocused";

import WithTooltip from "^components/WithTooltip";

import { s_menu } from "^styles/menus";
import s_transition from "^styles/transition";
import { checkIsExistingLanguage } from "^helpers/languages";
import { Language } from "^types/language";

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

  const allLanguages = useSelector(selectLanguages);
  const docLanguages = useSelector((state) =>
    selectLanguagesByIds(state, docLanguageIds)
  );
  const validDocLanguages = docLanguages.filter((l) => {
    return typeof l !== "undefined";
  }) as Language[];

  const inputValueIsDocLanguage = checkIsExistingLanguage(
    inputValue,
    validDocLanguages
  );

  const dispatch = useDispatch();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (inputValueIsDocLanguage) {
      return;
    }

    const allLanguagesFormatted = allLanguages.map((l) => ({
      id: l.id,
      name: l.name?.toLowerCase(),
    }));
    const inputFormatted = inputValue.toLowerCase();
    const existingLanguage = allLanguagesFormatted.find(
      (t) => t.name === inputFormatted
    );

    if (existingLanguage) {
      onSubmit(existingLanguage.id);
    } else {
      dispatch(addOne({ name: inputValue }));
      setInputValue("");
      const languageId = inputValue;
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
            <WithTooltip text="language already exists">
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
  const allLanguages = useSelector(selectLanguages);

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
            const languageNameFormatted = capitalizeFirstLetter(
              language?.name || ""
            );

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

export default LanguagesInputWithSelect;
