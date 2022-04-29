import type { NextPage } from "next";
import tw from "twin.macro";
import { Plus, Trash } from "phosphor-react";
import { v4 as generateUId } from "uuid";

import useGetSubRouteId from "^hooks/useGetSubRouteId";

import { createDocTranslationContext } from "^context/DocTranslationContext";
import { DocTopLevelControlsContext } from "^context/DocTopLevelControlsContext";

import { DEFAULTLANGUAGEID } from "^constants/data";

import { useDispatch, useSelector } from "^redux/hooks";

import { useFetchArticlesQuery } from "^redux/services/articles";
import { useFetchTagsQuery } from "^redux/services/tags";
import { useFetchLanguagesQuery } from "^redux/services/languages";

import {
  selectById,
  updateDate,
  addTranslation,
  deleteTranslation,
} from "^redux/state/articles";
import { selectAll as selectAllTags } from "^redux/state/tags";
import {
  selectAll as selectAllLanguagues,
  addOne as addLanguage,
} from "^redux/state/languages";

import { Article as ArticleType, ArticleTranslation } from "^types/article";

import Head from "^components/Head";
import QueryDataInit from "^components/QueryDataInit";
import Header from "^components/header";
import RichTextEditor from "^components/text-editor/Rich";
import DatePicker from "^components/date-picker";
import AuthorPopover from "^components/AuthorPopover";
import WithTooltip from "^components/WithTooltip";
import WithProximityPopover from "^components/WithProximityPopover";
import { iconButtonDefault } from "^styles/common";
import TextFormInput from "^components/TextFormInput";
import WithWarning from "^components/WithWarning";
import useHovered from "^hooks/useHovered";

//* fetches within fetch queries won't be invoked if have been already

// todo: author panel: can delete if unused; can delete with warning if used; can edit and update (need to be able to update!)
// todo: redirect if article doesn't exist
// todo: translation for dates
// todo: go over button css abstractions; could have an 'action' type button;
// todo: format language data in uniform way (e.g. to lowercase; maybe capitalise)

const ArticlePage: NextPage = () => {
  const queryData = [
    useFetchArticlesQuery(),
    useFetchTagsQuery(),
    useFetchLanguagesQuery(),
  ];

  return (
    <>
      <Head />
      <QueryDataInit queryData={queryData}>
        <PageContent />
      </QueryDataInit>
    </>
  );
};

export default ArticlePage;

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

const s_canvas = tw`bg-gray-50 pt-md pb-lg px-md border-2 border-gray-200 flex-grow flex flex-col`;

const useArticleData = () => {
  const articleId = useGetSubRouteId();
  const article = useSelector((state) =>
    selectById(state, articleId)
  ) as ArticleType;

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
        <TranslationTabs />
        <div css={[s_article.container]}>
          <article
            css={[
              tw`prose p-sm prose-sm sm:prose md:prose-lg lg:prose-xl font-serif-eng focus:outline-none`,
            ]}
          >
            <header css={[tw`flex flex-col gap-sm`]}>
              <Date />
              <Title />
              <Author />
            </header>
          </article>
        </div>
      </>
    </DocTranslationProvider>
  );
};

const s_article = {
  container: tw`bg-white py-xl pb-lg px-sm shadow-md flex-grow flex justify-center`,
};

const TranslationTabs = () => {
  const dispatch = useDispatch();

  const article = useArticleData();
  const translations = article.translations;

  const languages = useSelector(selectAllLanguagues);

  const { activeTranslation, setActiveTranslationId } =
    useDocTranslationContext();

  const canDeleteTranslation = translations.length > 1;

  return (
    <div css={[tw`self-start flex items-center`]}>
      {translations.map((translation) => {
        const language = languages.find((l) => l.id === translation.languageId);
        const noLanguageErrStr = "language error";
        const languageStr = language ? language.name : noLanguageErrStr;

        const translationIsActive = translation.id === activeTranslation.id;

        return (
          <div
            css={[
              tw`rounded-t-md  font-medium py-xxs px-md flex gap-sm select-none`,
              translationIsActive
                ? tw`bg-white shadow-lg`
                : tw`text-gray-400 cursor-pointer`,
            ]}
            key={translation.id}
          >
            <div
              css={[tw`capitalize`]}
              onClick={() => setActiveTranslationId(translation.id)}
            >
              {languageStr}
            </div>
          </div>
        );
      })}
      <AddTranslationPopover />
    </div>
  );
};

const TranslationTab = () => {
  const [containerIsHovered, hoveredHandlers] = useHovered();

  return (
    <div css={[tw`grid place-items-center`]} {...hoveredHandlers}>
      <WithWarning
        callbackToConfirm={() =>
          dispatch(
            deleteTranslation({
              id: article.id,
              translationId: translation.id,
            })
          )
        }
        disabled={!canDeleteTranslation}
        warningText={{
          heading: `Delete ${language?.name || ""} translation?`,
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
              !canDeleteTranslation && tw`opacity-40 cursor-default`,
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
        <AddTranslationPanel onAddTranslation={close!} />
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

const AddTranslationPanel = ({
  onAddTranslation,
}: {
  onAddTranslation: () => void;
}) => {
  const dispatch = useDispatch();
  const { id, translations } = useArticleData();

  const languages = useSelector(selectAllLanguagues);
  const usedLanguageIds = translations.map(
    (translation) => translation.languageId
  );

  const handleAddTranslation = (languageId: string) => {
    dispatch(addTranslation({ id, languageId }));
    onAddTranslation();
  };

  return (
    <div css={[tw`p-lg min-w-[35ch] flex flex-col gap-sm`]}>
      <h3 css={[tw`text-xl font-medium`]}>Add translation</h3>
      <div>
        <h4 css={[tw`font-medium mb-sm`]}>Existing languages</h4>
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
      </div>
      <div>
        <h4 css={[tw`font-medium mb-sm`]}>Add new language</h4>
        <AddNewLanguage
          onAddNewLanguage={(languageId) => {
            handleAddTranslation(languageId);
          }}
        />
      </div>
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

    const id = generateUId();
    dispatch(addLanguage({ id, name: languageName }));
    onAddNewLanguage(id);
  };

  return (
    <div>
      <TextFormInput
        onUpdate={handleNewLanguageSubmit}
        placeholder="Add language name"
      />
    </div>
  );
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

const Title = () => {
  const fallbackContent = "<h1></h1>";
  const initialContent = fallbackContent;
  const onUpdate = (output: string) => null;

  const customDocContent = "heading";
  const placeholder = () => "Enter title here";

  return (
    <RichTextEditor
      docContent={customDocContent}
      initialContent={initialContent}
      onUpdate={onUpdate}
      placeholder={placeholder}
    />
  );
};

const Author = () => {
  const article = useArticleData();
  const author = article.translations.find(
    (t) => t.languageId === article.defaultTranslationId
  );

  return <AuthorPopover authorId={author?.id} languageId={DEFAULTLANGUAGEID} />;
};
