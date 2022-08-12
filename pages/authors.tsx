import { NextPage } from "next";
import { ReactElement } from "react";
import tw from "twin.macro";
import {
  Article as ArticleIcon,
  Funnel,
  Notepad as NotepadIcon,
  Plus,
  PlusCircle,
  Translate,
  Trash,
  VideoCamera as VideoCameraIcon,
} from "phosphor-react";

import { Collection } from "^lib/firebase/firestore/collectionKeys";

import { useDispatch, useSelector } from "^redux/hooks";
import { selectById as selectLanguageById } from "^redux/state/languages";
import {
  addOne as addAuthorAction,
  removeOne as deleteAuthorAction,
  addTranslation as addTranslationAction,
} from "^redux/state/authors";
import { removeAuthor as removeAuthorFromArticle } from "^redux/state/articles";
import { selectAll as selectAllAuthors } from "^redux/state/authors";

import { AuthorProvider, useAuthorContext } from "^context/AuthorContext";
import {
  AuthorTranslationProvider,
  useAuthorTranslationContext,
} from "^context/AuthorTranslationContext";

import useHovered from "^hooks/useHovered";
// import useAuthorArticles from "^hooks/data/useAuthorArticles";
import useAuthorsPageTopControls from "^hooks/pages/useAuthorsPageTopControls";

import { fuzzySearchAuthors } from "^helpers/authors";
import { applyFilters, filterDocsByLanguageId } from "^helpers/general";

import { default_language_Id } from "^constants/data";

import { Author } from "^types/author";
import { Language } from "^types/language";

import WithProximityPopover from "^components/WithProximityPopover";
import LanguagesInputWithSelect from "^components/languages/LanguageInputWithSelect";
import MissingText from "^components/MissingText";
import WithTooltip from "^components/WithTooltip";
import InlineTextEditor from "^components/editors/Inline";
import WithWarning from "^components/WithWarning";
import LanguageMissingFromStore from "^components/LanguageMissingFromStore";
import Head from "^components/Head";
import QueryDatabase from "^components/QueryDatabase";
import UndoButtonUI from "^components/header/UndoButtonUI";
import SaveButtonUI from "^components/header/SaveButtonUI";
import SaveTextUI from "^components/header/SaveTextUI";
import LanguageSelectInitial from "^components/LanguageSelect";

import s_transition from "^styles/transition";
import { s_popover } from "^styles/popover";
import s_button from "^styles/button";
import useFilterArticlesByUse from "^hooks/data/useFilterArticlesByUse";
import useFilterRecordedEventsByUse from "^hooks/data/useFilterRecordedEventsByUse";
import {
  ContentMenuButton,
  ContentMenuVerticalBar,
} from "^components/menus/Content";
import useFilterBlogsByUse from "^hooks/data/useFilterBlogsByUse";
import WithRelatedContent from "^components/WithRelatedContent";
import HeaderGeneric2 from "^components/header/HeaderGeneric2";
import {
  ContentFilterProvider,
  useContentFilterContext,
} from "^context/ContentFilterContext";

// todo: go over delete author, as well as on collection, tags, etc. pages. Include recorded events

// todo| NICE TO HAVES
// todo: when author translations go over 2 lines, not clear that author menu belongs to that author

const AuthorsPage: NextPage = () => {
  return (
    <>
      <Head />
      <QueryDatabase
        collections={[
          Collection.ARTICLES,
          Collection.AUTHORS,
          Collection.BLOGS,
          Collection.LANGUAGES,
          Collection.RECORDEDEVENTS,
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
    <div css={[tw`min-h-screen`]}>
      <Header />
      <Main />
    </div>
  );
};

const Header = () => {
  const { handleSave, handleUndo, isChange, saveMutationData } =
    useAuthorsPageTopControls();

  return (
    <HeaderGeneric2
      confirmBeforeLeavePage={isChange}
      leftElements={
        <SaveTextUI isChange={isChange} saveMutationData={saveMutationData} />
      }
      rightElements={
        <>
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
        </>
      }
    />
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

const AuthorsFilterAndList = () => {
  return (
    <ContentFilterProvider>
      <AuthorsFilterAndListUI />
    </ContentFilterProvider>
  );
};

const AuthorsFilterAndListUI = () => {
  return (
    <div css={[tw`mt-md`]}>
      <FiltersUI />
      <div css={[tw`mt-sm flex flex-col gap-xs`]}>
        <div css={[tw`self-end`]}>
          <AddAuthorButton />
        </div>
        <List />
      </div>
    </div>
  );
};

const AddAuthorButton = () => {
  const dispatch = useDispatch();

  const addAuthor = () =>
    dispatch(addAuthorAction({ languageId: default_language_Id, name: "" }));

  return <AddAuthorButtonUI addAuthor={addAuthor} />;
};

const AddAuthorButtonUI = ({ addAuthor }: { addAuthor: () => void }) => {
  return (
    <button
      css={[
        tw`-translate-y-xs cursor-pointer flex items-center gap-sm py-1 px-2 border-2 rounded-sm text-blue-500 border-blue-500`,
      ]}
      onClick={addAuthor}
    >
      <span css={[tw`text-xs uppercase font-medium`]}>Add author</span>
      <span css={[tw`text-blue-400`]}>
        <Plus weight="bold" />
      </span>
    </button>
  );
};

const FiltersUI = () => (
  <div css={[tw`flex flex-col gap-sm`]}>
    <h3 css={[tw`font-medium text-xl flex items-center gap-xs`]}>
      <span>
        <Funnel />
      </span>
      <span>Filters</span>
    </h3>
    <div css={[tw`flex flex-col gap-xs`]}>
      <AuthorSearch />
      <div>
        <LanguageSelect />
      </div>
    </div>
  </div>
);

const AuthorSearch = () => {
  const { query, setQuery } = useContentFilterContext();

  return <AuthorSearchUI onValueChange={setQuery} value={query} />;
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
  const { selectedLanguage, setSelectedLanguage } = useContentFilterContext();

  return (
    <LanguageSelectInitial
      selectedLanguage={selectedLanguage}
      setSelectedLanguage={setSelectedLanguage}
    />
  );
};

const List = () => {
  const authors = useSelector(selectAllAuthors);

  const { query, selectedLanguage } = useContentFilterContext();

  const filterAuthorsByLanguage = (authors: Author[]) =>
    filterDocsByLanguageId(authors, selectedLanguage.id);

  const filterAuthorsBySearch = (authors: Author[]) => {
    const validSearch = query.length > 1;
    if (!validSearch) {
      return authors;
    }

    const result = fuzzySearchAuthors(query, authors);

    return result;
  };

  const filteredAuthors = applyFilters(authors, [
    filterAuthorsByLanguage,
    filterAuthorsBySearch,
  ]);

  return (
    <ListUI
      areAuthorsPostFilter={Boolean(filteredAuthors.length)}
      areAuthorsPreFilter={Boolean(authors.length)}
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

const ListUI = ({
  authors,
  areAuthorsPostFilter,
  areAuthorsPreFilter,
}: {
  authors: ReactElement;
  areAuthorsPreFilter: boolean;
  areAuthorsPostFilter: boolean;
}) => {
  return areAuthorsPostFilter ? (
    <div css={[tw`flex flex-col gap-md`]}>{authors}</div>
  ) : (
    <div>
      <p>{!areAuthorsPreFilter ? "No authors yet" : "No authors for filter"}</p>
    </div>
  );
};

const ListAuthor = ({ index }: { index: number }) => {
  const number = index + 1;

  return (
    <ListAuthorUI number={number} translations={<ListAuthorTranslations />} />
  );
};

const ListAuthorUI = ({
  number,
  translations,
}: {
  number: number;
  translations: ReactElement;
}) => {
  return (
    <div css={[tw`flex gap-sm`]} className="group">
      <div css={[tw`flex gap-sm`]}>
        <div css={[tw`text-gray-600 w-[30px]`]}>{number}.</div>
        <div css={[tw`flex flex-col gap-sm`]}>{translations}</div>
      </div>
      <div css={[tw`ml-lg grid place-items-center`]}>
        <AuthorMenu />
      </div>
    </div>
  );
};

const AuthorMenu = () => {
  return (
    <menu css={[s_transition.onGroupHover, tw`flex items-center gap-xs`]}>
      <AddAuthorTranslationPopover />
      <ContentMenuVerticalBar />
      <AuthorArticlesPopover />
      <AuthorBlogsPopover />
      <AuthorRecordedEventsPopover />
      <ContentMenuVerticalBar />
      <DeleteAuthor />
    </menu>
  );
};

const AddAuthorTranslationPopover = () => {
  return (
    <WithProximityPopover
      panel={({ close: closePanel }) => (
        <AddAuthorTranslationPanel closePanel={closePanel} />
      )}
    >
      <AddAuthorTranslationButtonUI />
    </WithProximityPopover>
  );
};

const AddAuthorTranslationButtonUI = () => (
  <ContentMenuButton tooltipProps={{ text: "add translation", type: "action" }}>
    <PlusCircle />
  </ContentMenuButton>
);

const AddAuthorTranslationPanel = ({
  closePanel,
}: {
  closePanel: () => void;
}) => {
  const [{ id, translations }] = useAuthorContext();

  const authorLanguageIds = translations.map((t) => t.languageId);

  const dispatch = useDispatch();

  const onSubmitTranslationLanguage = (languageId: string) => {
    dispatch(addTranslationAction({ id, languageId }));
    closePanel();
  };

  return (
    <AddAuthorTranslationPanelUI
      languageInputSelect={
        <LanguagesInputWithSelect
          docLanguageIds={authorLanguageIds}
          docType="author"
          onSubmit={onSubmitTranslationLanguage}
        />
      }
    />
  );
};

const AddAuthorTranslationPanelUI = ({
  languageInputSelect,
}: {
  languageInputSelect: ReactElement;
}) => {
  return (
    <div css={[s_popover.panelContainer]}>
      <div>
        <h4 css={[s_popover.title, tw`text-base`]}>Add author translation</h4>
        <p css={[tw`text-gray-600 mt-xs text-sm`]}>
          Search for an existing language or create a new one.
        </p>
      </div>
      <div>{languageInputSelect}</div>
    </div>
  );
};

const AuthorArticlesPopover = () => {
  const [{ id: authorId }] = useAuthorContext();

  const authorArticles = useFilterArticlesByUse("authorIds", authorId);

  return (
    <WithRelatedContent
      relatedContent={authorArticles}
      contentType="author"
      relatedContentType="articles"
    >
      <AuthorArticlesButtonUI />
    </WithRelatedContent>
  );
};

const AuthorArticlesButtonUI = () => (
  <ContentMenuButton tooltipProps={{ text: "author articles" }}>
    <ArticleIcon />
  </ContentMenuButton>
);

const AuthorBlogsPopover = () => {
  const [{ id: authorId }] = useAuthorContext();

  const authorBlogs = useFilterBlogsByUse("authorIds", authorId);

  return (
    <WithRelatedContent
      relatedContent={authorBlogs}
      relatedContentType="blogs"
      contentType="author"
    >
      <AuthorBlogsButtonUI />
    </WithRelatedContent>
  );
};

const AuthorBlogsButtonUI = () => (
  <ContentMenuButton tooltipProps={{ text: "author blogs" }}>
    <NotepadIcon />
  </ContentMenuButton>
);

const AuthorRecordedEventsPopover = () => {
  const [{ id: authorId }] = useAuthorContext();

  const authorRecordedEvents = useFilterRecordedEventsByUse(
    "authorIds",
    authorId
  );

  return (
    <WithRelatedContent
      relatedContent={authorRecordedEvents}
      contentType="author"
      relatedContentType="recorded events"
    >
      <AuthorRecordedEventsButtonUI />
    </WithRelatedContent>
  );
};

const AuthorRecordedEventsButtonUI = () => (
  <ContentMenuButton tooltipProps={{ text: "author recorded events" }}>
    <VideoCameraIcon />
  </ContentMenuButton>
);

const DeleteAuthor = () => {
  const dispatch = useDispatch();

  const [{ id: authorId }] = useAuthorContext();

  const authorArticles = useFilterArticlesByUse("authorIds", authorId);

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
      <ContentMenuButton
        tooltipProps={{ text: "delete author", type: "action" }}
      >
        <Trash />
      </ContentMenuButton>
    </WithWarning>
  );
};

const ListAuthorTranslations = () => {
  const [{ id: authorId, translations }] = useAuthorContext();

  return (
    <ListAuthorTranslationsUI
      translations={
        <>
          {translations.map((t, i) => {
            return (
              <AuthorTranslationProvider
                authorId={authorId}
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
  return (
    <div css={[tw`flex items-center gap-sm flex-wrap`]}>{translations}</div>
  );
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
  const [containerIsHovered, hoverHandlers] = useHovered();

  return (
    <div
      css={[tw`flex gap-sm items-center relative`]}
      // className="group"
      {...hoverHandlers}
    >
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
            injectedValue={authorTranslationText}
            onUpdate={onTranslationChange}
            placeholder="author..."
            minWidth={30}
          >
            {({ isFocused: isEditing }) => (
              <>
                {!authorTranslationText.length && !isEditing ? (
                  <MissingText tooltipText="missing author translation" />
                ) : null}
              </>
            )}
          </InlineTextEditor>
        </WithTooltip>
        <p css={[tw`flex gap-xxxs items-center`]}>
          <span css={[tw`text-xs -translate-y-1 text-gray-500`]}>
            <Translate />
          </span>
          {language}
        </p>
      </div>
      <DeleteAuthorTranslationUI show={containerIsHovered} />
    </div>
  );
};

const DeleteAuthorTranslationUI = ({ show }: { show: boolean }) => {
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
      <WithTooltip text="delete translation">
        <button
          css={[
            s_transition.toggleVisiblity(show),
            tw`absolute z-10 bottom-0 right-0 translate-y-1/2 translate-x-1/2 p-xxs rounded-full text-sm text-gray-400 border`,
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
    <LanguageMissingFromStore />
  );
};
