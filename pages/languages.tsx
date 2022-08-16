import { NextPage } from "next";
import {
  Article as ArticleIcon,
  CloudArrowUp,
  Funnel,
  Plus,
  Prohibit,
  Trash,
} from "phosphor-react";
import { Dispatch, ReactElement, SetStateAction, useState } from "react";
import tw from "twin.macro";
import { RadioGroup } from "@headlessui/react";

import useLanguagesPageTopControls from "^hooks/pages/useLanguagesPageTopControls";
import { useLeavePageConfirm } from "^hooks/useLeavePageConfirm";
import useFocused from "^hooks/useFocused";
import useLanguageArticles from "^hooks/data/useLanguageArticles";

import { siteLanguageIds } from "^constants/data";

import { Collection } from "^lib/firebase/firestore/collectionKeys";

import { useDispatch, useSelector } from "^redux/hooks";
import {
  addOne,
  selectAll,
  updateName,
  removeOne,
} from "^redux/state/languages";
import { selectAll as selectAllArticles } from "^redux/state/articles";

import {
  checkIsExistingLanguage,
  fuzzySearchLanguages,
} from "^helpers/languages";
import { applyFilters } from "^helpers/general";

import { Language } from "^types/language";

import WithProximityPopover from "^components/WithProximityPopover";
import WithTooltip from "^components/WithTooltip";
import Head from "^components/Head";
import SaveButtonUI from "^components/header/SaveButtonUI";
import SaveTextUI from "^components/header/SaveTextUI";
import SideBar from "^components/header/SideBar";
import UndoButtonUI from "^components/header/UndoButtonUI";
import QueryDatabase from "^components/QueryDatabase";
import InlineTextEditor from "^components/editors/Inline";
import MissingText from "^components/MissingText";
import WithWarning from "^components/WithWarning";
import WithRelatedArticles from "^components/WithRelatedArticles";

import { s_header } from "^styles/header";
import { s_popover } from "^styles/popover";
import s_transition from "^styles/transition";
import { s_editorMenu } from "^styles/menus";

// todo: allow unformatted input of language name, and format when need to search

const Languages: NextPage = () => {
  return (
    <>
      <Head />
      <QueryDatabase collections={[Collection.LANGUAGES, Collection.ARTICLES]}>
        <PageContent />
      </QueryDatabase>
    </>
  );
};

export default Languages;

const PageContent = () => {
  return (
    <div css={[tw`min-h-screen flex-col gap-lg`]}>
      <Header />
      <Main />
    </div>
  );
};

const Header = () => {
  const { handleSave, handleUndo, isChange, saveMutationData } =
    useLanguagesPageTopControls();

  useLeavePageConfirm({ runConfirmOn: isChange });

  return (
    <header css={[s_header.container, tw`border-b`]}>
      <div css={[tw`flex items-center gap-lg`]}>
        <SideBar />
        <div css={[s_header.spacing]}>
          <SaveTextUI isChange={isChange} saveMutationData={saveMutationData} />
        </div>
      </div>
      <div css={[s_header.spacing]}>
        <UndoButtonUI
          handleUndo={handleUndo}
          isChange={isChange}
          isLoadingSave={saveMutationData.isLoading}
        />
        <SaveButtonUI
          handleSave={handleSave}
          isChange={isChange}
          isLoadingSave={saveMutationData.isLoading}
        />
        <div css={[s_header.verticalBar]} />
        <button css={[s_header.button]}>
          <CloudArrowUp />
        </button>
      </div>
    </header>
  );
};

const Main = () => {
  return (
    <div css={[tw`flex justify-center`]}>
      <main css={[s_top.main, tw`px-xl max-w-[1600px]`]}>
        <div>
          <h1 css={[s_top.pageTitle]}>Languages</h1>
          <p css={[tw`text-gray-600 text-sm mt-sm`]}>
            Add, edit and delete languages. Languages connected to a document
            can&apos;t be deleted.
          </p>
        </div>
        <LanguagesFilterAndList />
      </main>
    </div>
  );
};

const s_top = {
  main: tw`px-4 mt-2xl flex flex-col gap-lg flex-grow`,
  pageTitle: tw`text-2xl font-medium`,
};

const LanguagesFilterAndList = () => {
  const [searchValue, setSearchValue] = useState("");
  const [usedType, setUsedType] = useState<UsedTypeFilter>("all");

  return (
    <LanguagesFilterAndListUI
      filters={
        <LanguagesFilterUI
          search={
            <LanguagesSearch
              searchValue={searchValue}
              setSearchValue={setSearchValue}
            />
          }
          usedTypeSelect={
            <UsedTypeSelect setValue={setUsedType} value={usedType} />
          }
        />
      }
      list={<LanguagesList searchValue={searchValue} usedType={usedType} />}
    />
  );
};

const LanguagesFilterAndListUI = ({
  filters,
  list,
}: {
  filters: ReactElement;
  list: ReactElement;
}) => {
  return (
    <div css={[tw`mt-md`]}>
      {filters}
      <div css={[tw`mt-sm flex flex-col gap-xs`]}>
        <div css={[tw`self-end`]}>
          <AddLanguagePopover />
        </div>
        {list}
      </div>
    </div>
  );
};

const AddLanguageButtonUI = () => {
  return (
    <button
      css={[
        tw`-translate-y-xs cursor-pointer flex items-center gap-sm py-1 px-2 border-2 rounded-sm text-blue-500 border-blue-500`,
      ]}
    >
      <span css={[tw`text-xs uppercase font-medium`]}>Add Language</span>
      <span css={[tw`text-blue-400`]}>
        <Plus weight="bold" />
      </span>
    </button>
  );
};

const AddLanguagePopover = () => {
  return (
    <WithProximityPopover
      panel={({ close: closePanel }) => (
        <AddLanguagePanelUI
          newLanguageInput={<NewLanguageForm closePanel={closePanel} />}
        />
      )}
    >
      <AddLanguageButtonUI />
    </WithProximityPopover>
  );
};

const AddLanguagePanelUI = ({
  newLanguageInput,
}: {
  newLanguageInput: ReactElement;
}) => {
  return (
    <div css={[s_popover.panelContainer]}>
      <h3 css={[s_popover.title]}>Add language</h3>
      {newLanguageInput}
    </div>
  );
};

const newLanguageInputId = "new-language-input-id";

const NewLanguageForm = ({ closePanel }: { closePanel: () => void }) => {
  const [value, setValue] = useState("");

  const [formIsFocused, focusHandlers] = useFocused();

  const dispatch = useDispatch();

  const languages = useSelector(selectAll);

  const valueIsExistingLanguage = checkIsExistingLanguage(value, languages);

  const handleSubmit = () => {
    if (valueIsExistingLanguage) {
      return;
    }

    dispatch(addOne({ name: value }));
    closePanel();
  };

  return (
    <NewLanguageFormUI
      focusHandlers={focusHandlers}
      formIsFocused={formIsFocused}
      handleSubmit={handleSubmit}
      input={
        <NewLanguageInputUI
          formIsFocused={formIsFocused}
          setValue={setValue}
          value={value}
        />
      }
      inputValueIsExistingLanguage={valueIsExistingLanguage}
    />
  );
};

type FocusHandlers = ReturnType<typeof useFocused>[1];

const NewLanguageFormUI = ({
  focusHandlers,
  formIsFocused,
  handleSubmit,
  input,
  inputValueIsExistingLanguage,
}: {
  focusHandlers: FocusHandlers;
  formIsFocused: boolean;
  handleSubmit: () => void;
  input: ReactElement;
  inputValueIsExistingLanguage: boolean;
}) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      {...focusHandlers}
    >
      <div css={[tw`relative inline-block`]}>
        {input}
        <label
          css={[
            tw`absolute left-2 top-1/2 -translate-y-1/2 text-gray-500`,
            !formIsFocused && tw`text-gray-300`,
          ]}
          htmlFor={newLanguageInputId}
        >
          <Plus />
        </label>
        {inputValueIsExistingLanguage ? (
          <WithTooltip text="language already exists">
            <span
              css={[
                tw`absolute top-1/2 -translate-y-1/2 right-2 text-red-warning`,
                !formIsFocused && tw`text-gray-300`,
              ]}
            >
              <Prohibit />
            </span>
          </WithTooltip>
        ) : null}
      </div>
    </form>
  );
};

const NewLanguageInputUI = ({
  formIsFocused,
  setValue,
  value,
}: {
  formIsFocused: boolean;
  setValue: (value: string) => void;
  value: string;
}) => (
  <input
    css={[
      tw`text-gray-800 px-lg py-1 text-sm outline-none border-2 border-transparent focus:border-gray-200 rounded-sm`,
      !formIsFocused && tw`text-gray-400`,
    ]}
    id={newLanguageInputId}
    value={value}
    onChange={(e) => setValue(e.target.value)}
    placeholder="Add a new language..."
    type="text"
    autoComplete="off"
  />
);

const LanguagesFilterUI = ({
  search,
  usedTypeSelect,
}: {
  search: ReactElement;
  usedTypeSelect: ReactElement;
}) => {
  return (
    <div css={[tw`flex flex-col gap-sm`]}>
      <h3 css={[tw`font-medium text-xl flex items-center gap-xs`]}>
        <span>
          <Funnel />
        </span>
        <span>Filters</span>
      </h3>
      <div css={[tw`flex flex-col gap-xs`]}>{search}</div>
      <div>{usedTypeSelect}</div>
    </div>
  );
};

const languageFilterInputId = "language-filter-input-id";

const LanguagesSearch = ({
  searchValue,
  setSearchValue,
}: {
  searchValue: string;
  setSearchValue: (value: string) => void;
}) => {
  return (
    <div css={[tw`relative flex items-center gap-xs`]}>
      <label htmlFor={languageFilterInputId}>Language name:</label>
      <input
        css={[
          tw`text-gray-600 text-sm focus:text-gray-800 px-xs py-1 outline-none border-2 border-transparent focus:border-gray-200 rounded-sm`,
        ]}
        id={languageFilterInputId}
        value={searchValue}
        onChange={(e) => {
          const value = e.target.value;
          setSearchValue(value);
        }}
        placeholder="language name..."
        type="text"
        autoComplete="off"
      />
    </div>
  );
};

export type UsedTypeFilter = "used" | "unused" | "all";

const typeSelectOptionsData: { value: UsedTypeFilter }[] = [
  { value: "all" },
  { value: "used" },
  { value: "unused" },
];

const UsedTypeSelect = ({
  setValue,
  value,
}: {
  setValue: Dispatch<SetStateAction<UsedTypeFilter>>;
  value: UsedTypeFilter;
}) => {
  return (
    <RadioGroup
      as="div"
      css={[tw`flex items-center gap-md`]}
      value={value}
      onChange={setValue}
    >
      <RadioGroup.Label css={[tw``]}>Type:</RadioGroup.Label>
      <div css={[tw`flex items-center gap-sm`]}>
        {typeSelectOptionsData.map((option) => (
          <RadioGroup.Option value={option.value} key={option.value}>
            {({ checked }) => (
              <span
                css={[
                  checked
                    ? tw`underline text-green-active`
                    : tw`cursor-pointer`,
                ]}
              >
                {option.value}
              </span>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
};

const LanguagesList = ({
  searchValue,
  usedType,
}: {
  searchValue: string;
  usedType: UsedTypeFilter;
}) => {
  const allLanguages = useSelector(selectAll);
  const allArticles = useSelector(selectAllArticles);

  const siteLanguageIdsArr = Object.values(siteLanguageIds);

  const usedLanguagesById = [
    ...allArticles.flatMap((a) => a.translations).flatMap((t) => t.languageId),
    ...siteLanguageIdsArr,
  ];

  const checkLanguageIsSiteLanguage = (languageId: string) =>
    siteLanguageIdsArr.includes(languageId);

  const checkLanguageIsUsed = (languageId: string) => {
    const isUsed = usedLanguagesById.includes(languageId);

    return isUsed;
  };

  const filterLanguagesByUsedType = (languages: Language[]) =>
    usedType === "all"
      ? languages
      : languages.filter((language) => {
          const isUsed = checkLanguageIsUsed(language.id);

          return usedType === "used" ? isUsed : !isUsed;
        });

  const filterLanguagesByQuery = (languages: Language[]) => {
    const validSearch = searchValue.length > 1;
    if (!validSearch) {
      return languages;
    }

    const result = fuzzySearchLanguages(searchValue, languages);

    return result;
  };

  const filteredLanguages = applyFilters(allLanguages, [
    filterLanguagesByUsedType,
    filterLanguagesByQuery,
  ]);

  return (
    <LanguagesListUI
      areLanguagesPostFilter={Boolean(filteredLanguages.length)}
      areLanguagesPreFilter={Boolean(allLanguages.length)}
      languages={
        <>
          {filteredLanguages.map((language, i) => (
            <ListLanguageUI
              languageName={
                <LanguageInput
                  language={language}
                  disabled={checkLanguageIsSiteLanguage(language.id)}
                />
              }
              languageMenu={
                <LanguageMenu
                  articlesButton={
                    <LanguageArticlesPopover languageId={language.id} />
                  }
                  deleteButton={
                    <DeleteLanguage
                      canDelete={!Boolean(checkLanguageIsUsed(language.id))}
                      id={language.id}
                    />
                  }
                />
              }
              number={i + 1}
              key={language.id}
            />
          ))}
        </>
      }
    />
  );
};

const LanguagesListUI = ({
  languages,
  areLanguagesPostFilter,
  areLanguagesPreFilter,
}: {
  languages: ReactElement;
  areLanguagesPreFilter: boolean;
  areLanguagesPostFilter: boolean;
}) => {
  return areLanguagesPostFilter ? (
    <div css={[tw`flex flex-col gap-md`]}>{languages}</div>
  ) : (
    <div>
      <p>
        {!areLanguagesPreFilter
          ? "No languages yet"
          : "No languages for filter"}
      </p>
    </div>
  );
};

const ListLanguageUI = ({
  number,
  languageName,
  languageMenu,
}: {
  number: number;
  languageName: ReactElement;
  languageMenu: ReactElement;
}) => {
  return (
    <div css={[tw`flex gap-sm`]} className="group">
      <div css={[tw`flex gap-sm`]}>
        <div css={[tw`text-gray-600 w-[20px]`]}>{number}.</div>
        <p>{languageName}</p>
      </div>
      <div css={[tw`ml-lg grid place-items-center`]}>
        {languageMenu}
        {/* <LanguageMenu /> */}
      </div>
    </div>
  );
};

const LanguageInput = ({
  disabled = false,
  language,
}: {
  disabled?: boolean;
  language: Language;
}) => {
  const dispatch = useDispatch();

  const updateLanguageName = (name: string) => {
    dispatch(updateName({ id: language.id, name }));
  };

  return (
    <WithTooltip
      text={!disabled ? "edit text" : "can't edit this language"}
      type="action"
      placement="top"
    >
      <div>
        <InlineTextEditor
          injectedValue={language.name}
          onUpdate={updateLanguageName}
          placeholder="language..."
          disabled={disabled}
        >
          {({ isFocused: isEditing }) => (
            <>
              {!language.name.length && !isEditing ? (
                <MissingText tooltipText="missing language name" />
              ) : null}
            </>
          )}
        </InlineTextEditor>
      </div>
    </WithTooltip>
  );
};

// delete (if not used)
const LanguageMenu = ({
  articlesButton,
  deleteButton,
}: {
  articlesButton: ReactElement;
  deleteButton: ReactElement;
}) => {
  return (
    <menu css={[s_transition.onGroupHover, tw`flex items-center gap-sm`]}>
      {articlesButton}
      {deleteButton}
    </menu>
  );
};

const LanguageArticlesPopover = ({ languageId }: { languageId: string }) => {
  const languageArticles = useLanguageArticles(languageId);

  return (
    <WithRelatedArticles
      articles={languageArticles}
      subTitleText={{
        noArticles: "No articles exist with a translation in this language",
        withArticles: "Articles with a translation in this language",
      }}
      title="Language articles"
    >
      <LanguageArticlesButtonUI />
    </WithRelatedArticles>
  );
};

const LanguageArticlesButtonUI = () => {
  return (
    <WithTooltip text="language articles">
      <button
        css={[
          s_editorMenu.button,
          tw`relative text-gray-500 hover:text-gray-700`,
        ]}
        type="button"
      >
        <ArticleIcon />
      </button>
    </WithTooltip>
  );
};

const DeleteLanguage = ({
  canDelete,
  id,
}: {
  canDelete: boolean;
  id: string;
}) => {
  const dispatch = useDispatch();

  if (!canDelete) {
    return null;
  }

  const deleteLanguage = () => dispatch(removeOne({ id }));

  return <DeleteLanguageButtonUI deleteLanguage={deleteLanguage} />;
};

const DeleteLanguageButtonUI = ({
  deleteLanguage,
}: {
  deleteLanguage: () => void;
}) => {
  return (
    <WithWarning
      callbackToConfirm={deleteLanguage}
      warningText={{
        heading: "Delete language?",
        body: "This language is not used and can safely be deleted.",
      }}
      type="moderate"
    >
      <WithTooltip text="delete language" type="action">
        <button
          css={[tw`text-gray-400 hover:text-red-warning flex items-center`]}
          type="button"
        >
          <Trash />
        </button>
      </WithTooltip>
    </WithWarning>
  );
};
