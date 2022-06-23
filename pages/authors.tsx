import { NextPage } from "next";
import tw from "twin.macro";
import {
  Article as ArticleIcon,
  CaretDown,
  Check,
  CloudArrowUp,
  Funnel,
  Translate,
  Trash,
} from "phosphor-react";

import { Collection } from "^lib/firebase/firestore/collectionKeys";

import { useDispatch, useSelector } from "^redux/hooks";
import {
  selectAll as selectAllLanguages,
  selectById as selectLanguageById,
} from "^redux/state/languages";
import { removeOne as deleteAuthorAction } from "^redux/state/authors";
import { removeAuthor as removeAuthorFromArticle } from "^redux/state/articles";

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
  createContext,
  Fragment,
  ReactElement,
  useContext,
  useState,
} from "react";
import { Listbox, Transition } from "@headlessui/react";
import { Language } from "^types/language";
import s_button from "^styles/button";
import { selectAll as selectAllAuthors } from "^redux/state/authors";
import { applyFilters, numberToLetter } from "^helpers/general";
// import produce from "immer";
import WithTooltip from "^components/WithTooltip";
import InlineTextEditor from "^components/editors/Inline";
import WithWarning from "^components/WithWarning";
import LanguageError from "^components/LanguageError";
import { AuthorProvider, useAuthorContext } from "^context/AuthorContext";
import {
  AuthorTranslationProvider,
  useAuthorTranslationContext,
} from "^context/AuthorTranslationContext";
import { Article } from "^types/article";
import useAuthorArticles from "^hooks/data/useAuthorArticles";
import s_transition from "^styles/transition";

// todo: add author
// todo: author articles as table; button as icon only; as popover - button next to trash icon?
// todo: save functionality

// todo: on articles page, can click on translation language to change title translation. Indicate title language

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

type SelectedLanguageContextValue = {
  selectedLanguage: Language;
  setSelectedLanguage: (language: Language) => void;
};
const SelectedLanguageContext = createContext<SelectedLanguageContextValue>(
  {} as SelectedLanguageContextValue
);
const SelectedLanguageProvider = ({ children }: { children: ReactElement }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(
    allLanguagesSelectOption
  );

  return (
    <SelectedLanguageContext.Provider
      value={{ selectedLanguage, setSelectedLanguage }}
    >
      {children}
    </SelectedLanguageContext.Provider>
  );
};
const useSelectLanguageContext = () => {
  const context = useContext(SelectedLanguageContext);
  if (context === undefined) {
    throw new Error(
      "useDocTranslationContext must be used within its provider!"
    );
  }
  return context;
};

const AuthorsFilterAndList = () => {
  const [searchValue, setSearchValue] = useState("");

  return (
    <SelectedLanguageProvider>
      <AuthorsFilterAndListUI
        filter={
          <Filter
            onSearchValueChange={(value) => setSearchValue(value)}
            searchValue={searchValue}
          />
        }
        list={<List searchValue={searchValue} />}
      />
    </SelectedLanguageProvider>
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
}: {
  onSearchValueChange: (value: string) => void;
  searchValue: string;
}) => {
  return (
    <FilterUI
      authorSearch={
        <AuthorSearch onValueChange={onSearchValueChange} value={searchValue} />
      }
      languageSelect={<LanguageSelect />}
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

const LanguageSelect = () => {
  const languages = useSelector(selectAllLanguages);
  const languageOptions = [allLanguagesSelectOption, ...languages];

  const { selectedLanguage, setSelectedLanguage } = useSelectLanguageContext();

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
            {/*             <span css={[s_button.subIcon, tw`text-sm -translate-y-1`]}>
              <Translate />
            </span> */}
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

const List = ({ searchValue }: { searchValue: string }) => {
  const authors = useSelector(selectAllAuthors);

  const { selectedLanguage } = useSelectLanguageContext();

  // todo: refactor below to take authors as an arg - won't work within applyFilters as is
  const filterAuthorsByLanguage = () =>
    selectedLanguage.id === "_ALL"
      ? authors
      : authors.filter((author) => {
          const { translations } = author;
          const authorLanguageIds = translations.flatMap((t) => t.languageId);
          const hasLanguage = authorLanguageIds.includes(selectedLanguage.id);

          return hasLanguage;
        });

  const filteredAuthors = applyFilters({
    initialArr: authors,
    filters: [filterAuthorsByLanguage],
  });

  return (
    <ListUI
      authors={
        <>
          {filteredAuthors.map((author, i) => (
            <AuthorProvider author={author} key={author.id}>
              <ListAuthor index={i} />
            </AuthorProvider>
          ))}
        </>
      }
    />
  );
};

const ListUI = ({ authors }: { authors: ReactElement }) => {
  return <div css={[tw`flex flex-col gap-md`]}>{authors}</div>;
};

const ListAuthor = ({ index }: { index: number }) => {
  const number = index + 1;

  return (
    <ListAuthorUI
      articles={<AuthorArticles />}
      number={number}
      translations={<ListAuthorTranslations />}
    />
  );
};

const ListAuthorUI = ({
  articles,
  number,
  translations,
}: {
  articles: ReactElement;
  number: number;
  translations: ReactElement;
}) => {
  return (
    <div css={[tw`flex gap-sm`]} className="group">
      <div css={[tw`text-gray-600 mr-sm`]}>{number}.</div>
      <div css={[tw`flex flex-col gap-sm`]}>
        {translations}
        {articles}
      </div>
      <div css={[tw`ml-xl`]}>
        <DeleteAuthor />
      </div>
    </div>
  );
};

const DeleteAuthor = () => {
  const dispatch = useDispatch();

  const { author } = useAuthorContext();
  const { id: authorId } = author;

  const authorArticles = useAuthorArticles(authorId);

  const deleteAuthor = () => {
    for (let i = 0; i < authorArticles.length; i++) {
      const article = authorArticles[i];
      dispatch(removeAuthorFromArticle({ authorId, id: article.id }));
    }
    dispatch(deleteAuthorAction({ id: authorId }));
  };

  return <DeleteAuthorUI deleteAuthor={deleteAuthor} />;
};

const DeleteAuthorUI = ({ deleteAuthor }: { deleteAuthor: () => void }) => {
  return (
    <WithWarning
      warningText={{
        heading: "Delete author?",
        body: "This will affect all documents this author is connected to.",
      }}
      callbackToConfirm={deleteAuthor}
    >
      <WithTooltip text="delete author" type="action">
        <button
          css={[
            s_transition.onGroupHover,
            tw`text-gray-400 hover:text-red-warning flex items-center`,
          ]}
          type="button"
        >
          <span css={[tw`invisible w-0`]}>H</span>
          <Trash />
        </button>
      </WithTooltip>
    </WithWarning>
  );
};

const ListAuthorTranslations = () => {
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
  const { author } = useAuthorContext();
  const { translations } = author;

  return (
    <ListAuthorTranslationsUI
      translations={
        <>
          {translations.map((t, i) => {
            return (
              <AuthorTranslationProvider
                authorId={author.id}
                canDelete={translations.length > 1}
                translation={t}
                key={t.id}
              >
                <ListAuthorTranslation isFirst={i === 0} />
              </AuthorTranslationProvider>
            );
          })}
        </>
      }
    />
  );
};

const ListAuthorTranslationsUI = ({
  translations,
}: {
  translations: ReactElement;
}) => {
  return <div css={[tw`flex items-center gap-sm`]}>{translations}</div>;
};

const ListAuthorTranslation = ({ isFirst }: { isFirst: boolean }) => {
  /*   const { selectedLanguage } = useSelectLanguageContext();
  const selectedLanguageId = selectedLanguage.id; */

  const { translation, updateName } = useAuthorTranslationContext();

  /*   const isSelectedLanguage =
    selectedLanguageId === allLanguagesId ||
    translation.languageId === selectedLanguageId; */

  return (
    <ListAuthorTranslationUI
      authorTranslationText={translation.name}
      deleteTranslation={<DeleteAuthorTranslation />}
      isFirst={isFirst}
      language={<AuthorTranslationLanguage />}
      onTranslationChange={updateName}
    />
  );
};

const ListAuthorTranslationUI = ({
  authorTranslationText,
  isFirst,
  language,
  onTranslationChange,
}: {
  authorTranslationText: string;
  isFirst: boolean;
  language: ReactElement;
  onTranslationChange: (text: string) => void;
}) => {
  return (
    <div css={[tw`flex gap-sm items-center`]} className="group">
      {!isFirst ? <div css={[tw`h-[20px] w-[0.5px] bg-gray-200`]} /> : null}
      <div css={[tw`flex gap-xs`]}>
        <WithTooltip
          text={{
            header: "Edit author translation",
            body: "Updating this author will affect this author across all documents it's a part of.",
          }}
          placement="bottom"
        >
          <InlineTextEditor
            initialValue={authorTranslationText}
            onUpdate={onTranslationChange}
            placeholder="author..."
            minWidth={30}
          />
        </WithTooltip>
        <p css={[tw`flex gap-xxxs items-center`]}>
          <span css={[tw`text-xs -translate-y-1 text-gray-500`]}>
            <Translate />
          </span>
          {language}
        </p>
      </div>
    </div>
  );
};

const DeleteAuthorTranslation = () => {
  return <DeleteAuthorTranslationUI />;
};

const DeleteAuthorTranslationUI = () => {
  const { canDelete, handleDelete } = useAuthorTranslationContext();

  if (!canDelete) {
    return null;
  }

  return (
    <WithWarning
      callbackToConfirm={handleDelete}
      warningText={{
        heading: "Delete translation?",
        body: "This will affect all documents this author is connected to.",
      }}
    >
      <WithTooltip text="delete author translation">
        <button
          css={[
            tw`invisible opacity-0 group-hover:visible group-hover:opacity-100`,
            tw`absolute z-10 bottom-0 right-0 translate-y-1/2 translate-x-1/2 p-xxs rounded-full bg-gray-50 border`,
            s_button.deleteIconOnHover,
            tw`transition-all ease-in-out duration-75`,
          ]}
          type="button"
        >
          <Trash />
        </button>
      </WithTooltip>
    </WithWarning>
  );
};

const AuthorTranslationLanguage = () => {
  const { translation } = useAuthorTranslationContext();
  const { languageId } = translation;

  const language = useSelector((state) =>
    selectLanguageById(state, languageId)
  );

  return <AuthorTranslationLanguageUI language={language} />;
};

const AuthorTranslationLanguageUI = ({
  language,
}: {
  language: Language | undefined;
}) => {
  return language ? (
    <span css={[tw`capitalize text-gray-600 text-sm`]}>{language.name}</span>
  ) : (
    <LanguageError />
  );
};

const AuthorArticles = () => {
  const [showArticles, setShowArticles] = useState(false);

  const { author } = useAuthorContext();
  const { id: authorId } = author;

  const authorArticles = useAuthorArticles(authorId);

  return (
    <AuthorArticlesUI
      articles={authorArticles}
      authorHasArticle={Boolean(authorArticles.length)}
      showArticles={showArticles}
      toggleShowArticles={() => setShowArticles(!showArticles)}
    />
  );
};

const AuthorArticlesUI = ({
  articles,
  authorHasArticle,
  showArticles,
  toggleShowArticles,
}: {
  articles: Article[];
  authorHasArticle: boolean;
  showArticles: boolean;
  toggleShowArticles: () => void;
}) => {
  return (
    <div>
      <WithTooltip
        text={showArticles ? "hide articles" : "show articles"}
        type="action"
      >
        <h3
          css={[
            tw`font-medium text-gray-700 inline-flex items-center gap-xs cursor-pointer`,
          ]}
          onClick={toggleShowArticles}
        >
          <span css={[tw`text-gray-600 text-lg`]}>
            <ArticleIcon />
          </span>
          <span css={[tw`text-sm`]}>Articles</span>
          <span css={[tw`text-gray-400 text-xs`]}>
            <CaretDown />
          </span>
        </h3>
      </WithTooltip>
      {showArticles ? (
        <>
          <p css={[tw`text-gray-600 text-sm mt-xxs`]}>
            {!authorHasArticle
              ? "This author hasn't written an article yet"
              : "Articles this author has (co-)written"}
          </p>
          {articles.length ? (
            <div css={[tw`mt-xs flex flex-col gap-sm`]}>
              {articles.map((article, i) => (
                <AuthorArticle article={article} index={i} key={article.id} />
              ))}
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
};

const AuthorArticle = ({
  article,
  index,
}: {
  article: Article;
  index: number;
}) => {
  const { translations } = article;

  const listNum = numberToLetter(index);

  return <AuthorArticleUI listNum={listNum} translations={translations} />;
};

const AuthorArticleUI = ({
  translations,
  listNum,
}: {
  translations: Article["translations"];
  listNum: string;
}) => {
  return (
    <div css={[tw`flex gap-xs`]}>
      <div css={[tw`text-gray-600`]}>{listNum}.</div>
      <div css={[tw`flex-grow flex flex-col gap-xs`]}>
        {translations.map((translation) => (
          <AuthorArticleTitleTranslation
            translation={translation}
            key={translation.id}
          />
        ))}
      </div>
    </div>
  );
};

const AuthorArticleTitleTranslation = ({
  translation,
}: {
  translation: Article["translations"][number];
}) => {
  const { languageId, title } = translation;

  const titleStr = title?.length ? title : "[no title]";

  const language = useSelector((state) =>
    selectLanguageById(state, languageId)
  );

  return (
    <AuthorArticleTitleTranslationUI
      articleTitle={titleStr}
      language={<AuthorArticleLanguageUI language={language} />}
    />
  );
};

const AuthorArticleTitleTranslationUI = ({
  articleTitle,
  language,
}: {
  articleTitle: string;
  language: ReactElement;
}) => {
  return (
    <div css={[tw`flex flex-col gap-sm`]} className="group">
      <div css={[tw`flex gap-xs`]}>
        {articleTitle}
        <p css={[tw`flex gap-xxxs items-center`]}>
          <span css={[tw`text-xs -translate-y-1 text-gray-500`]}>
            <Translate />
          </span>
          {language}
        </p>
      </div>
    </div>
  );
};

const AuthorArticleLanguageUI = ({
  language,
}: {
  language: Language | undefined;
}) => {
  return language ? (
    <span css={[tw`capitalize text-gray-600 text-sm`]}>{language.name}</span>
  ) : (
    <LanguageError />
  );
};
