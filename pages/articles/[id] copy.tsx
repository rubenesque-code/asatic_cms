import type { NextPage } from "next";
import { ReactElement, useEffect } from "react";
import { useRouter } from "next/router";
import tw from "twin.macro";
import { Plus, Trash, WarningCircle } from "phosphor-react";

import { createDocTranslationContext } from "^context/DocTranslationContext";
import { DocTopLevelControlsContext } from "^context/DocTopLevelControlsContext";

import { useDispatch, useSelector } from "^redux/hooks";

import { useFetchArticlesQuery } from "^redux/services/articles";
import { useFetchTagsQuery } from "^redux/services/tags";
import { useFetchLanguagesQuery } from "^redux/services/languages";

import {
  selectById,
  updateDate,
  addTranslation,
  deleteTranslation,
  addAuthor,
  updateTitle,
} from "^redux/state/articles";
// import { selectAll as selectAllTags } from "^redux/state/tags";
import {
  selectAll as selectAllLanguagues,
  selectById as selectLanguageById,
  addOne as addLanguage,
} from "^redux/state/languages";

import useGetSubRouteId from "^hooks/useGetSubRouteId";
import useHovered from "^hooks/useHovered";

import { ROUTES } from "^constants/routes";
// import { DEFAULTLANGUAGEID } from "^constants/data";

import { ArticleTranslation } from "^types/article";

import Head from "^components/Head";
import QueryDataInit from "^components/QueryDataInit";
import Header from "^components/header";
// import RichTextEditor from "^components/text-editor/Rich";
import DatePicker from "^components/date-picker";
import AuthorPopover from "^components/AuthorPopover";
import WithTooltip from "^components/WithTooltip";
import WithProximityPopover from "^components/WithProximityPopover";
import TextFormInput from "^components/TextFormInput";
import WithWarning from "^components/WithWarning";
import InlineTextEditor from "^components/text-editor/Inline";

import { s_canvas, s_translationTabs } from "^styles/common";

// * need default translation functionality?

// todo: author panel: can delete if unused; can delete with warning if used; can edit and update (need to be able to update!)
// todo: translation for dates
// todo: go over button css abstractions; could have an 'action' type button;
// todo: format language data in uniform way (e.g. to lowercase; maybe capitalise)
// todo: save functionality
// todo: different english font with more weights. Title shouldn't be bold.
// todo: translation tab controls transition

// todo: article body
// todo: translation functionality. Probably better if have a different instance for each translation - will make e.g. handling inputs easier
// todo: tags

const ArticlePage: NextPage = () => {
  //* fetches below won't be invoked if already have been
  const queryData = [
    useFetchArticlesQuery(),
    useFetchTagsQuery(),
    useFetchLanguagesQuery(),
  ];

  return (
    <>
      <Head />
      <QueryDataInit queryData={queryData}>
        <HandleRouteValidity>
          <PageContent />
        </HandleRouteValidity>
      </QueryDataInit>
    </>
  );
};

export default ArticlePage;

const HandleRouteValidity = ({ children }: { children: ReactElement }) => {
  const articleId = useGetSubRouteId();
  const article = useSelector((state) => selectById(state, articleId));

  const router = useRouter();

  useEffect(() => {
    if (article) {
      return;
    }
    setTimeout(() => {
      router.push(ROUTES.ARTICLES);
    }, 850);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article]);

  if (article) {
    return children;
  }

  return (
    <div css={[tw`w-full h-full grid place-items-center`]}>
      <p>Couldn&apos;t find article. Redirecting...</p>
    </div>
  );
};

const PageContent = () => {
  return (
    <div css={[tw`min-h-screen flex flex-col`]}>
      <PageHeader />
      <div css={[s_canvas]}>
        <Article />
      </div>
    </div>
  );
};

const PageHeader = () => {
  return (
    <DocTopLevelControlsContext
      isChange={true}
      save={{
        func: () => null,
        saveMutationData: {
          isError: false,
          isLoading: false,
          isSuccess: false,
        },
      }}
      undo={{ func: () => null }}
    >
      <Header />
    </DocTopLevelControlsContext>
  );
};

const useArticleData = () => {
  const articleId = useGetSubRouteId();
  const article = useSelector((state) => selectById(state, articleId))!;

  return article;
};

const { DocTranslationProvider, useDocTranslationContext } =
  createDocTranslationContext<ArticleTranslation>();

const Article = () => {
  const article = useArticleData();

  return (
    <DocTranslationProvider
      initialTranslationId={article.defaultTranslationId}
      translations={article.translations}
    >
      <>
        <TranslationTabsPanel />
        <ArticleTranslations />
      </>
    </DocTranslationProvider>
  );
};

const TranslationTabsPanel = () => {
  const article = useArticleData();
  const translations = article.translations;

  return (
    <div css={[s_translationTabs.panel]}>
      {translations.map((translation) => {
        return (
          <TranslationTab
            languageId={translation.languageId}
            translationId={translation.id}
            key={translation.id}
          />
        );
      })}
      <AddTranslationPopover />
    </div>
  );
};

const TranslationTab = ({
  languageId,
  translationId,
}: {
  languageId: string;
  translationId: string;
}) => {
  const [tabIsHovered, hoveredHandlers] = useHovered();

  const { activeTranslation, setActiveTranslationId } =
    useDocTranslationContext();
  const isActive = activeTranslation.id === translationId;

  const language = useSelector((state) =>
    selectLanguageById(state, languageId)
  );
  const noLanguageErrStr = "error";
  const languageStr = language ? language.name : noLanguageErrStr;

  return (
    <div
      css={[
        s_translationTabs.tab,
        isActive ? s_translationTabs.active : s_translationTabs.inactive,
      ]}
      {...hoveredHandlers}
    >
      <div
        css={[s_translationTabs.textContainer]}
        onClick={() => setActiveTranslationId(translationId)}
      >
        <p css={[s_translationTabs.text]}>{languageStr}</p>
        {!language ? (
          <WithTooltip text="Language error. Possibly doesn't exist. Try refreshing the page">
            <span css={[tw`text-red-warning`]}>
              <WarningCircle />
            </span>
          </WithTooltip>
        ) : null}
      </div>
      <TranslationTabControls
        languageName={language?.name}
        show={tabIsHovered}
        translationId={translationId}
      />
    </div>
  );
};

const TranslationTabControls = ({
  languageName,
  show,
  translationId,
}: {
  languageName: string | undefined;
  show: boolean;
  translationId: string;
}) => {
  const dispatch = useDispatch();

  const { id: articleId, translations } = useArticleData();
  const canDeleteTranslation = translations.length > 1;

  return (
    <div css={[tw`grid place-items-center`, !show && tw`hidden`]}>
      <WithWarning
        callbackToConfirm={() =>
          dispatch(
            deleteTranslation({
              id: articleId,
              translationId,
            })
          )
        }
        disabled={!canDeleteTranslation}
        warningText={{
          heading: `Delete ${languageName || ""} translation?`,
        }}
      >
        <WithTooltip
          text={
            canDeleteTranslation
              ? "delete translation"
              : "can't delete - must have at least 1 translation"
          }
          yOffset={10}
        >
          <button
            css={[
              tw`text-sm grid place-items-center px-xxs rounded-full hover:bg-gray-100 active:bg-gray-200`,
              !canDeleteTranslation && tw`opacity-30 cursor-default`,
            ]}
            type="button"
          >
            <Trash />
          </button>
        </WithTooltip>
      </WithWarning>
    </div>
  );
};

const AddTranslationPopover = () => {
  return (
    <WithProximityPopover
      panelContentElement={({ close }) => (
        <AddTranslationPanel closePanel={close} />
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
};

const AddTranslationPanel = ({ closePanel }: { closePanel: () => void }) => {
  const dispatch = useDispatch();
  const { id: articleId, translations } = useArticleData();

  const languages = useSelector(selectAllLanguagues);
  const usedLanguageIds = translations.map(
    (translation) => translation.languageId
  );

  const handleAddTranslation = (languageId: string) => {
    dispatch(addTranslation({ id: articleId, languageId }));
    closePanel();
  };

  return (
    <div css={[tw`p-lg min-w-[35ch] flex flex-col gap-sm`]}>
      <h3 css={[tw`text-xl font-medium`]}>Add translation</h3>
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
};

const AddNewLanguage = ({
  onAddNewLanguage,
}: {
  onAddNewLanguage: (languageId: string) => void;
}) => {
  // todo: error handling if lang already exists
  const dispatch = useDispatch();

  const languages = useSelector(selectAllLanguagues);
  const existingLanguageNames = languages.map((language) => language.name);

  const handleNewLanguageSubmit = (languageName: string) => {
    const languageInUse = existingLanguageNames.includes(languageName);
    if (languageInUse) {
      return;
    }

    dispatch(addLanguage({ id: languageName, name: languageName }));
    onAddNewLanguage(languageName);
  };

  return (
    <div>
      <h4 css={[tw`font-medium mb-sm`]}>Add new language</h4>
      <TextFormInput
        onSubmit={handleNewLanguageSubmit}
        placeholder="Enter language name"
      />
    </div>
  );
};

const ArticleTranslations = () => {
  const article = useArticleData();
  const translations = article.translations;

  const { activeTranslation } = useDocTranslationContext();

  return (
    <>
      {translations.map((translation) => {
        const isActive = translation.id === activeTranslation.id;

        return (
          <div
            css={[s_article.container, !isActive && tw`hidden`]}
            key={translation.id}
          >
            <article
              css={[
                tw`prose p-sm prose-sm sm:prose md:prose-lg lg:prose-xl font-serif-eng focus:outline-none`,
              ]}
            >
              <header css={[tw`flex flex-col gap-sm`]}>
                <Date />
                <Title translationId={translation.id} />
                <Author translationId={translation.id} />
              </header>
            </article>
          </div>
        );
      })}
    </>
  );
};

const s_article = {
  container: tw`bg-white py-xl pb-lg px-sm shadow-md flex-grow flex justify-center`,
};

const Date = () => {
  const dispatch = useDispatch();

  const article = useArticleData();
  const date = article.publishInfo.date;

  return (
    <DatePicker
      date={date}
      onChange={(date) => dispatch(updateDate({ id: article.id, date }))}
    />
  );
};

const Title = ({ translationId }: { translationId: string }) => {
  const dispatch = useDispatch();

  const { id, translations } = useArticleData();

  const translation = translations.find((t) => t.id === translationId);
  const title = translation?.title;

  return (
    <div css={[tw`text-3xl font-serif-eng font-medium`]}>
      <InlineTextEditor
        initialValue={title || ""}
        onUpdate={(title) =>
          dispatch(updateTitle({ id, title, translationId }))
        }
        placeholder="Enter title here"
      />
    </div>
  );
};

const Author = ({ translationId }: { translationId: string }) => {
  const dispatch = useDispatch();

  const { translations, id: articleId, authorId } = useArticleData();
  const translation = translations.find((t) => t.id === translationId);
  const languageId = translation!.languageId;

  return (
    <div css={[tw`text-2xl font-serif-eng font-medium`]}>
      <AuthorPopover
        currentAuthorId={authorId}
        languageId={languageId}
        onAddAuthor={(authorId) =>
          dispatch(addAuthor({ id: articleId, authorId }))
        }
      />
    </div>
  );
};
