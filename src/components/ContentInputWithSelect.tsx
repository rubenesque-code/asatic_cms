import { FilePlus, Plus, Prohibit } from "phosphor-react";
import { ReactElement, useState } from "react";
import tw from "twin.macro";
import { fuzzySearch } from "^helpers/general";
import useFocused from "^hooks/useFocused";
import { useSelector } from "^redux/hooks";
import { selectAll as selectArticles } from "^redux/state/articles";
import { s_menu } from "^styles/menus";
import s_transition from "^styles/transition";
import WithTooltip from "./WithTooltip";

const ContentInputWithSelect = ({
  usedArticlesById,
  onSubmit,
}: {}) => {
  const [inputValue, setInputValue] = useState("");

  const [inputOrSelectIsFocused, focusHandlers] = useFocused();


  return (
    <ContentInputWithSelectUI
      focusHandlers={focusHandlers}
      input={
        <InputUI
          setValue={setInputValue}
          topContainerIsFocused={inputOrSelectIsFocused}
          value={inputValue}
        />
      }
    />
  );
};

export default ContentInputWithSelect;

type FocusHandlers = ReturnType<typeof useFocused>[1];

const ContentInputWithSelectUI = ({
  focusHandlers,
  input,
}: {
  focusHandlers: FocusHandlers;
  input: ReactElement;
}) => <div {...focusHandlers}>{input}</div>;

const inputId = "content-input-id";

type InputUIProps = {
  value: string;
  setValue: (value: string) => void;
  topContainerIsFocused: boolean;
};

const InputUI = ({ setValue, value, topContainerIsFocused }: InputUIProps) => (
  <div css={[tw`relative`]}>
    <input
      css={[
        tw`text-gray-800 px-lg py-1 text-sm outline-none border-2 border-transparent focus:border-gray-200 rounded-sm`,
        !topContainerIsFocused && tw`text-gray-400`,
      ]}
      id={inputId}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Add content..."
      type="text"
      autoComplete="off"
    />
    <label
      css={[
        tw`absolute left-2 top-1/2 -translate-y-1/2 text-gray-500`,
        !topContainerIsFocused && tw`text-gray-300`,
      ]}
      htmlFor={inputId}
    >
      <Plus />
    </label>
  </div>
);

type SelectProps = {
  usedArticlesById: string[];
  onSubmit?: () => void;
  query: string
}

const Select w = ({usedArticlesById, onSubmit, query}: SelectProps) => {
  const articles = useSelector(selectArticles);

  const checkArticleIsUsed = (id: string) => usedArticlesById.includes(id);

  const articlesMatchingQuery = fuzzySearch(["translations."], articles, query).map(
    (f) => f.item
  );

  return <SelectUI isAMatch={} matches={} show={} />;
};

type SelectUIProps ={
  show: boolean;
  isAMatch: boolean;
  matches: ReactElement[];
}

const SelectUI = ({
  matches,
  show,
  isAMatch,
}: SelectUIProps) => (
  <div
    css={[
      tw`absolute -bottom-2 translate-y-full w-full bg-white border-2 border-gray-200 rounded-sm py-sm text-sm shadow-lg`,
      show ? tw`opacity-100` : tw`opacity-0 h-0`,
      tw`transition-opacity duration-75 ease-linear`,
    ]}
  >
    <div css={[tw`flex flex-col gap-xs items-start`]}>
      {isAMatch ? matches : <p css={[tw`text-gray-600 ml-sm`]}>No matches</p>}
    </div>
  </div>
);

type SelectItemUIProps = {
  docBeingSubmittedToType: string;
  canSubmit: boolean;
  submit: () => void;
  text: string | ReactElement;
};

const SelectItemUI = ({
  canSubmit,
  docBeingSubmittedToType,
  submit,
  text,
}: SelectItemUIProps) => (
  <WithTooltip
    text={`add to ${docBeingSubmittedToType}`}
    isDisabled={canSubmit}
  >
    <button
      css={[
        !canSubmit ? s_menu.listItemText : tw`text-gray-400 cursor-auto`,
        tw`text-left py-1 relative w-full px-sm transition-opacity ease-in-out duration-75`,
      ]}
      className="group"
      onClick={submit}
      type="button"
    >
      <span>{text}</span>
      {!canSubmit ? (
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
