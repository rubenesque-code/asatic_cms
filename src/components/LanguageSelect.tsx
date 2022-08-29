import { createContext, ReactElement, useContext, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CaretDown as CaretDownIcon } from "phosphor-react";
import { Fragment } from "react";
import tw from "twin.macro";
import { useSelector } from "^redux/hooks";
import { selectLanguages } from "^redux/state/languages";
import s_button from "^styles/button";
import { Language } from "^types/language";
import { Expand } from "^types/utilities";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function LanguageSelect() {}

export type AllLanguageId = "_ALL";
type AllLanguageOptionLanguage = {
  id: AllLanguageId;
  name: " all";
};
export const allLanguageId: AllLanguageId = "_ALL";
const allLanguageOptionLanguage: AllLanguageOptionLanguage = {
  id: "_ALL",
  name: " all",
};

type OptionLanguage = Expand<Language | AllLanguageOptionLanguage>;

type Value = {
  selectedLanguage: Expand<OptionLanguage>;
  setSelectedLanguage: (language: OptionLanguage) => void;
};
const Context = createContext<Value>({} as Value);

LanguageSelect.Provider = function LanguageSelectProvider({
  children,
}: {
  children: ReactElement;
}) {
  const [selectedLanguage, setSelectedLanguage] = useState<OptionLanguage>(
    allLanguageOptionLanguage
  );

  return (
    <Context.Provider value={{ selectedLanguage, setSelectedLanguage }}>
      {children}
    </Context.Provider>
  );
};

LanguageSelect.useContext = function useLanguageSelectContext() {
  const { selectedLanguage } = useContext(Context);
  const contextIsPopulated = selectedLanguage;
  if (!contextIsPopulated) {
    throw new Error(
      "useLanguageSelectContext must be used within its provider!"
    );
  }
  return selectedLanguage;
};

function useLanguageSelectContext() {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error(
      "useLanguageSelectContext must be used within its provider!"
    );
  }
  return context;
}

LanguageSelect.Select = function Select() {
  const { selectedLanguage, setSelectedLanguage } = useLanguageSelectContext();

  const languages = useSelector(selectLanguages);
  const selectOptions = [allLanguageOptionLanguage, ...languages];

  return (
    <div css={[tw`relative flex items-center gap-md`]}>
      <p>Language:</p>
      <Listbox value={selectedLanguage} onChange={setSelectedLanguage}>
        <div css={[tw`relative z-10`]}>
          <Listbox.Button
            css={[tw`focus:outline-none flex items-center gap-xs`]}
          >
            <span>{selectedLanguage.name}</span>
            <span css={[s_button.subIcon, tw`text-xs`]}>
              <CaretDownIcon />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              css={[
                tw`absolute -bottom-sm translate-y-full left-0 bg-white py-md border shadow-md rounded-sm flex flex-col gap-sm`,
              ]}
            >
              {selectOptions.map((language) => {
                const isSelected = language.id === selectedLanguage.id;

                return (
                  <Listbox.Option
                    value={language}
                    css={[tw`list-none`]}
                    key={language.id}
                  >
                    <div css={[tw`px-xl`, !isSelected && tw`cursor-pointer`]}>
                      <span
                        css={[
                          isSelected &&
                            tw`relative  border-b border-green-active`,
                        ]}
                      >
                        {language.name}
                      </span>
                    </div>
                  </Listbox.Option>
                );
              })}
            </div>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};
