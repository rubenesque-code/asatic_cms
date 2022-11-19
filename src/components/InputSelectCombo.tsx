import { Plus } from "phosphor-react";
import { createContext, ReactElement, useContext, useState } from "react";
import tw from "twin.macro";
import { entityNameToLabel } from "^constants/data";
import { checkObjectHasField } from "^helpers/general";
import useHovered from "^hooks/useHovered";
import s_transition from "^styles/transition";
import { EntityName } from "^types/entity";
import { TranslationLanguage_ } from "./_containers/TranslationLanguage";

type ComponentContextValue = {
  inputIsFocused: boolean;
  inputValue: string;
  setInputIsFocused: (isFocused: boolean) => void;
  setInputValue: (inputValue: string) => void;
};

const ComponentContext = createContext<ComponentContextValue>(
  {} as ComponentContextValue
);

const ComponentProvider = ({ children }: { children: ReactElement }) => {
  const [inputIsFocused, setInputIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");

  return (
    <ComponentContext.Provider
      value={{ inputIsFocused, inputValue, setInputIsFocused, setInputValue }}
    >
      {children}
    </ComponentContext.Provider>
  );
};

function InputSelectCombo({ children }: { children: ReactElement }) {
  return (
    <ComponentProvider>
      <div css={[tw`relative w-full`]}>{children}</div>
    </ComponentProvider>
  );
}

export default InputSelectCombo;

InputSelectCombo.useContext = function useInputSelectContext() {
  const context = useContext(ComponentContext);
  const contextIsEmpty = !checkObjectHasField(context);
  if (contextIsEmpty) {
    throw new Error("useInputSelectContext must be used within its provider!");
  }
  return context;
};

const inputId = "input-select-combo-input-id";

InputSelectCombo.Input = function Input({
  onSubmit,
  placeholder,
  languageId,
}: {
  onSubmit: (inputValue: string) => void;
  placeholder: string;
  languageId?: string;
}) {
  const { inputValue, setInputValue, setInputIsFocused, inputIsFocused } =
    useContext(ComponentContext);

  return (
    <div css={[tw`relative inline-block`]}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(inputValue);
        }}
      >
        <div css={[tw`relative`]}>
          <input
            css={[
              tw`px-lg py-1 text-sm outline-none border-2 border-transparent focus:border-gray-200 rounded-sm`,
            ]}
            style={{
              width: !inputValue.length ? `${placeholder.length + 10}ch` : 300,
            }}
            id={inputId}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            type="text"
            autoComplete="off"
            onFocus={() => setInputIsFocused(true)}
            onBlur={() => setInputIsFocused(false)}
          />
          <label
            css={[tw`absolute left-2 top-1/2 -translate-y-1/2 text-gray-500`]}
            htmlFor={inputId}
          >
            <Plus />
          </label>
          {languageId ? (
            <div
              css={[
                tw`absolute right-0 -top-3 bg-white rounded-sm`,
                s_transition.toggleVisiblity(inputIsFocused),
              ]}
            >
              <TranslationLanguage_ languageId={languageId} />
            </div>
          ) : null}
        </div>
      </form>
    </div>
  );
};

InputSelectCombo.Select = function Select({
  children,
  isItem,
  isMatch,
  entityName,
}: {
  children: ReactElement[] | ReactElement;
  isItem?: boolean;
  isMatch?: boolean;
  entityName: EntityName;
}) {
  const [isHovered, hoveredHandlers] = useHovered();
  const { inputIsFocused } = useContext(ComponentContext);

  if (!inputIsFocused) {
    return null;
  }

  return (
    <div
      css={[
        tw`absolute -bottom-2 translate-y-full w-full bg-white border-2 border-gray-200 rounded-sm py-sm px-sm text-sm shadow-lg`,
        inputIsFocused || isHovered ? tw`opacity-100` : tw`opacity-0 h-0`,
        tw`transition-opacity duration-75 ease-linear`,
      ]}
      {...hoveredHandlers}
    >
      {!isItem ? (
        <p css={[tw`text-gray-400 ml-sm italic`]}>
          No unused {entityNameToLabel(entityName)}s
        </p>
      ) : !isMatch ? (
        <p css={[tw`text-gray-600 ml-sm`]}>No matches</p>
      ) : (
        <div css={[tw`flex flex-col gap-xs items-start w-full`]}>
          {children}
        </div>
      )}
    </div>
  );
};

/* InputSelectCombo.Select = function Select({
  children,
  show,
  isMatch,
}: {
  children: ReactElement[] | ReactElement;
  show?: boolean;
  isMatch?: boolean;
}) {
  const [isHovered, hoveredHandlers] = useHovered();
  const { inputIsFocused } = useContext(ComponentContext);

  if (!show) {
    return null;
  }

  return (
    <div
      css={[
        tw`absolute -bottom-2 translate-y-full w-full bg-white border-2 border-gray-200 rounded-sm py-sm px-sm text-sm shadow-lg`,
        inputIsFocused || isHovered ? tw`opacity-100` : tw`opacity-0 h-0`,
        tw`transition-opacity duration-75 ease-linear`,
      ]}
      {...hoveredHandlers}
    >
      {(Array.isArray(children) && children.length) || isMatch ? (
        <div css={[tw`flex flex-col gap-xs items-start w-full`]}>
          {children}
        </div>
      ) : (
        <p css={[tw`text-gray-600 ml-sm`]}>No matches</p>
      )}
    </div>
  );
};
 */
