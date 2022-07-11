import { FilePlus, Plus } from "phosphor-react";
import { ReactElement, useState } from "react";
import tw from "twin.macro";
import useFocused from "^hooks/useFocused";
import useSearchArticles from "^hooks/useSearchArticles";
import { useSelector } from "^redux/hooks";
import { selectAll as selectArticles } from "^redux/state/articles";
import { s_menu } from "^styles/menus";
import s_transition from "^styles/transition";
import { LandingSectionCustom } from "^types/landing";
import ArticleAsListItem from "./articles/ArticleAsListItem";
import WithTooltip from "./WithTooltip";

type TopProps = Pick<SelectProps, "usedArticlesById" | "onSubmit">;

const ContentInputWithSelect = ({ usedArticlesById, onSubmit }: TopProps) => {
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
      select={
        <Select
          query={inputValue}
          usedArticlesById={usedArticlesById}
          onSubmit={onSubmit}
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
  select,
}: {
  focusHandlers: FocusHandlers;
  input: ReactElement;
  select: ReactElement;
}) => (
  <div css={[tw`relative w-full`]} {...focusHandlers}>
    <div css={[tw`inline-block`]}>{input}</div>
    {select}
  </div>
);

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
  onSubmit: (
    docId: string,
    type: LandingSectionCustom["components"][number]["type"]
  ) => void;
  query: string;
};

const Select = ({ usedArticlesById, onSubmit, query }: SelectProps) => {
  const articles = useSelector(selectArticles);

  const articlesMatchingQuery = useSearchArticles(query, articles);

  return (
    <SelectUI
      isAMatch={Boolean(articlesMatchingQuery.length)}
      matches={
        <>
          <SelectContentTypeUI
            matches={articlesMatchingQuery.map((article) => {
              const canSubmit = !usedArticlesById.includes(article.id);

              return (
                <SelectItemUI
                  canSubmit={canSubmit}
                  docBeingSubmittedToType="landing"
                  submit={() => canSubmit && onSubmit(article.id, "article")}
                  key={article.id}
                >
                  <ArticleAsListItem article={article} />
                </SelectItemUI>
              );
            })}
            title="Articles"
          />
        </>
      }
      show={Boolean(query.length > 1)}
    />
  );
};

const SelectContentTypeUI = ({
  title,
  matches,
}: {
  title: string;
  matches: ReactElement[];
}) => (
  <div>
    <h5 css={[tw`font-medium`]}>{title}</h5>
    <div css={[tw`flex flex-col gap-xs mt-sm`]}>{matches}</div>
  </div>
);

type SelectUIProps = {
  show: boolean;
  isAMatch: boolean;
  matches: ReactElement;
};

const SelectUI = ({ matches, show, isAMatch }: SelectUIProps) => (
  <div
    css={[
      tw`absolute -bottom-2 translate-y-full w-full bg-white border-2 border-gray-200 rounded-sm py-sm text-sm shadow-lg`,
      show ? tw`opacity-100` : tw`opacity-0 h-0`,
      tw`transition-opacity duration-75 ease-linear`,
    ]}
  >
    <div css={[tw`flex flex-col gap-xs items-start px-sm`]}>
      {isAMatch ? matches : <p css={[tw`text-gray-600 ml-sm`]}>No matches</p>}
    </div>
  </div>
);

type SelectItemUIProps = {
  docBeingSubmittedToType: string;
  canSubmit: boolean;
  submit: () => void;
  children: string | ReactElement;
};

const SelectItemUI = ({
  canSubmit,
  docBeingSubmittedToType,
  submit,
  children,
}: SelectItemUIProps) => (
  <WithTooltip
    text={`add to ${docBeingSubmittedToType}`}
    isDisabled={canSubmit}
  >
    <button
      css={[
        canSubmit ? s_menu.listItemText : tw`text-gray-400 cursor-auto`,
        tw`text-left py-1 relative w-full px-sm transition-opacity ease-in-out duration-75`,
      ]}
      className="group"
      onClick={submit}
      type="button"
    >
      <span>{children}</span>
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
