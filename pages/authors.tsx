import { NextPage } from "next";
import tw from "twin.macro";
import {
  CaretDown,
  Check,
  CloudArrowUp,
  Funnel,
  Translate,
} from "phosphor-react";
import { v4 as generateUId } from "uuid";

import { Collection } from "^lib/firebase/firestore/collectionKeys";

import { useSelector } from "^redux/hooks";
import { selectAll as selectAllLanguages } from "^redux/state/languages";

import useImagesPageTopControls from "^hooks/pages/useImagesPageTopControls";
import { useLeavePageConfirm } from "^hooks/useLeavePageConfirm";

import Head from "^components/Head";
import QueryDatabase from "^components/QueryDatabase";
import SideBar from "^components/header/SideBar";
import UndoButtonUI from "^components/header/UndoButtonUI";
import SaveButtonUI from "^components/header/SaveButtonUI";
import SaveTextUI from "^components/header/SaveTextUI";

import { s_header } from "^styles/header";
import {
  Dispatch,
  Fragment,
  ReactElement,
  SetStateAction,
  useState,
} from "react";
import { Listbox, Transition } from "@headlessui/react";
import languages from "^redux/state/languages";
import { Language } from "^types/language";
import s_button from "^styles/button";
import {
  selectAll as selectAllAuthors,
  selectById,
} from "^redux/state/authors";
import { applyFilters } from "^helpers/general";
import { Author } from "^types/author";
import produce from "immer";

// pagetitle
// filter: search (include all translations), language
// list: all translations/by filter. Show articles written (will need this on frontend anyway)
// can delete author, but only if unconnected? Should allow to delete anyway

const AuthorsPage: NextPage = () => {
  return (
    <>
      <Head />
      <QueryDatabase
        collections={[
          Collection.AUTHORS,
          Collection.ARTICLES,
          Collection.LANGUAGES,
        ]}
      >
        <PageContent />
      </QueryDatabase>
    </>
  );
};

export default AuthorsPage;

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
    useImagesPageTopControls();

  useLeavePageConfirm({ runConfirmOn: isChange });

  return (
    <header css={[s_header.container, tw`border-b`]}>
      <div css={[tw`flex items-center gap-lg`]}>
        <SideBar />
        <div css={[s_header.spacing]}>
          <SaveTextUI
            isChange={isChange}
            isLoadingSave={saveMutationData.isLoading}
            isSaveError={saveMutationData.isError}
            isSaveSuccess={saveMutationData.isSuccess}
          />
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
        <h1 css={[s_top.pageTitle]}>Authors</h1>
        <AuthorsFilterAndList />
      </main>
    </div>
  );
};

const s_top = {
  main: tw`px-4 mt-2xl flex flex-col gap-lg flex-grow`,
  pageTitle: tw`text-2xl font-medium`,
};

const allLanguagesId = "_ALL";
const allLanguagesSelectOption: Language = {
  id: allLanguagesId,
  name: "all",
};

const AuthorsFilterAndList = () => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(
    allLanguagesSelectOption
  );

  return (
    <AuthorsFilterAndListUI
      filter={
        <Filter
          onSearchValueChange={(value) => setSearchValue(value)}
          searchValue={searchValue}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={(language) => setSelectedLanguage(language)}
        />
      }
      list={<List searchValue={searchValue} language={selectedLanguage} />}
    />
  );
};

const AuthorsFilterAndListUI = ({
  filter,
  list,
}: {
  filter: ReactElement;
  list: ReactElement;
}) => {
  return (
    <div css={[tw`mt-md`]}>
      {filter}
      <div css={[tw`flex flex-col gap-xs mt-lg`]}>{list}</div>
    </div>
  );
};

const Filter = ({
  onSearchValueChange,
  searchValue,
  selectedLanguage,
  setSelectedLanguage,
}: {
  onSearchValueChange: (value: string) => void;
  searchValue: string;
  selectedLanguage: Language;
  setSelectedLanguage: (language: Language) => void;
}) => {
  return (
    <FilterUI
      authorSearch={
        <AuthorSearch onValueChange={onSearchValueChange} value={searchValue} />
      }
      languageSelect={
        <LanguageSelect
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
        />
      }
    />
  );
};

const FilterUI = ({
  authorSearch,
  languageSelect,
}: {
  authorSearch: ReactElement;
  languageSelect: ReactElement;
}) => {
  return (
    <div css={[tw`flex flex-col gap-sm`]}>
      <h3 css={[tw`font-medium text-xl flex items-center gap-xs`]}>
        <span>
          <Funnel />
        </span>
        <span>Filters</span>
      </h3>
      <div css={[tw`flex flex-col gap-xs`]}>
        {authorSearch}
        <div>{languageSelect}</div>
      </div>
    </div>
  );
};

const AuthorSearch = ({
  onValueChange,
  value,
}: {
  onValueChange: (value: string) => void;
  value: string;
}) => {
  return <AuthorSearchUI onValueChange={onValueChange} value={value} />;
};

const authorFilterInputId = "author-filter-input-id";

const AuthorSearchUI = ({
  onValueChange,
  value,
}: {
  onValueChange: (value: string) => void;
  value: string;
}) => {
  return (
    <div css={[tw`relative flex items-center gap-xs`]}>
      <label htmlFor={authorFilterInputId}>Author name:</label>
      <input
        css={[
          tw`text-gray-600 focus:text-gray-800 px-xs py-1 outline-none border-2 border-transparent focus:border-gray-200 rounded-sm`,
        ]}
        id={authorFilterInputId}
        value={value}
        onChange={(e) => {
          const value = e.target.value;
          onValueChange(value);
        }}
        placeholder="author name..."
        type="text"
        autoComplete="off"
      />
    </div>
  );
};

const LanguageSelect = ({
  selectedLanguage,
  setSelectedLanguage,
}: {
  selectedLanguage: Language;
  setSelectedLanguage: (language: Language) => void;
}) => {
  const languages = useSelector(selectAllLanguages);
  const languageOptions = [allLanguagesSelectOption, ...languages];

  return (
    <LanguageSelectUI
      languages={languageOptions}
      selectedLanguage={selectedLanguage}
      setSelectedLanguage={setSelectedLanguage}
    />
  );
};

const LanguageSelectUI = ({
  languages,
  selectedLanguage,
  setSelectedLanguage,
}: {
  languages: Language[];
  selectedLanguage: Language;
  setSelectedLanguage: (language: Language) => void;
}) => {
  return (
    <div css={[tw`relative flex items-center gap-md`]}>
      <p>Language:</p>
      <Listbox value={selectedLanguage} onChange={setSelectedLanguage}>
        <div css={[tw`relative`]}>
          <Listbox.Button
            css={[tw`focus:outline-none flex items-center gap-xxxs`]}
          >
            <span css={[s_button.subIcon, tw`text-sm -translate-y-1`]}>
              <Translate />
            </span>
            <span>{selectedLanguage.name}</span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              css={[
                tw`absolute -bottom-sm translate-y-full left-0 bg-white py-sm border shadow-md rounded-sm flex flex-col gap-sm`,
              ]}
            >
              {languages.map((language) => {
                const isSelected = language.id === selectedLanguage.id;

                return (
                  <Listbox.Option
                    value={language}
                    css={[tw`list-none`]}
                    key={language.id}
                  >
                    <span
                      css={[
                        tw`relative px-lg`,
                        !isSelected && tw`cursor-pointer`,
                      ]}
                    >
                      <span css={[isSelected && tw`font-medium`]}>
                        {language.name}
                      </span>
                      {isSelected ? (
                        <span
                          css={[
                            tw`text-green-500 text-sm absolute left-sm -translate-x-1/2 top-1/2 -translate-y-1/2`,
                          ]}
                        >
                          <Check />
                        </span>
                      ) : null}
                    </span>
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

const List = ({
  language,
  searchValue,
}: {
  language: Language;
  searchValue: string;
}) => {
  const authors = useSelector(selectAllAuthors);

  const filterAuthorsByLanguage = () =>
    language.id === "_ALL"
      ? authors
      : authors.filter((author) => {
          const { translations } = author;
          const authorLanguageIds = translations.flatMap((t) => t.languageId);
          const hasLanguage = authorLanguageIds.includes(language.id);

          return hasLanguage;
        });

  const filteredAuthors = applyFilters({
    initialArr: authors,
    filters: [filterAuthorsByLanguage],
  });
  console.log("filteredAuthors:", filteredAuthors);

  return <ListUI />;
};

const ListUI = ({ authors }: { authors: Author[] }) => {
  return <div>Authors List</div>;
};

const ListAuthorUI = ({
  articles,
  number,
  translations,
}: {
  articles;
  number;
  translations;
}) => {
  return (
    <div>
      <div>{number}</div>
      <div>
        <div>Translations:</div>
        {translations}
      </div>
      <div>
        <div>Articles:</div>
        {articles}
      </div>
    </div>
  );
};

const ListAuthorTranslations = ({
  authorId,
  selectedLanguageId,
}: {
  authorId: string;
  selectedLanguageId: string;
}) => {
  const author = useSelector((state) => selectById(state, authorId))!;
  const { translations } = author;
  /*   const translationsOrdered = produce(translations, (draft) => {
    const selectedLanguageTranslationIndex = draft.findIndex(
      (t) => t.languageId === selectedLanguageId
    );
    if (selectedLanguageTranslationIndex) {
      const selectedLanguageTranslation = draft.splice(
        selectedLanguageTranslationIndex,
        1
      );
      draft.splice(0, 0, selectedLanguageTranslation)
      // draft.push(selectedLanguageTranslation);
    }
  }); */

  return (
    <ListAuthorTranslationsUI
      translations={translations}
      selectedLanguageId={selectedLanguageId}
    />
  );
};

const ListAuthorTranslationsUI = ({
  translations,
  selectedLanguageId,
}: {
  translations: Author["translations"];
  selectedLanguageId: string;
}) => {
  return (
    <div>
      {translations.map((t) => {
        const isSelectedLanguage =
          selectedLanguageId === allLanguagesId ||
          t.languageId === selectedLanguageId;

        return (
          <div key={t.id}>
            <span>{t.name}</span>
          </div>
        );
      })}
    </div>
  );
};
