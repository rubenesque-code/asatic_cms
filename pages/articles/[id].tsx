import type { NextPage } from "next";
import { ReactElement, useEffect } from "react";
import { useRouter } from "next/router";
import tw from "twin.macro";

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

import useGetSubRouteId from "^hooks/useGetSubRouteId";

import { ROUTES } from "^constants/routes";

import { ArticleTranslation } from "^types/article";

import Head from "^components/Head";
import QueryDataInit from "^components/QueryDataInit";
import Header from "^components/header";
// import RichTextEditor from "^components/text-editor/Rich";
import DatePicker from "^components/date-picker";
import AuthorPopover from "^components/AuthorPopover";
import InlineTextEditor from "^components/text-editor/Inline";

import { s_canvas } from "^styles/common";
import TranslationsPanel from "^components/TranslationsPanel";

// * need default translation functionality? (none added in this file or redux/state)

// todo: author panel: can delete if unused; can delete with warning if used; can edit and update (need to be able to update!)
// todo: translation for dates
// todo: go over button css abstractions; could have an 'action' type button;
// todo: format language data in uniform way (e.g. to lowercase; maybe capitalise)
// todo: save functionality
// todo: different english font with more weights. Title shouldn't be bold.
// todo: translation tab controls transition

// todo: article body
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
  return (
    <ArticleTranslationProvider>
      <>
        <ArticleTranslationsPanel />
        <ArticleTranslations />
      </>
    </ArticleTranslationProvider>
  );
};

const ArticleTranslationProvider = ({
  children,
}: {
  children: ReactElement;
}) => {
  const { translations } = useArticleData();

  return (
    <DocTranslationProvider translations={translations}>
      {children}
    </DocTranslationProvider>
  );
};

const ArticleTranslationsPanel = () => {
  const dispatch = useDispatch();

  const article = useArticleData();
  const { setActiveTranslationId, translations } = useDocTranslationContext();

  const handleDeleteTranslation = (translationId: string) => {
    const remainingTranslations = translations.filter(
      (t) => t.id !== translationId
    );
    const nextTranslationId = remainingTranslations[0].id;
    setActiveTranslationId(nextTranslationId);

    dispatch(deleteTranslation({ id: article.id, translationId }));
  };

  return (
    <TranslationsPanel
      addTranslation={(languageId: string) =>
        dispatch(addTranslation({ id: article.id, languageId }))
      }
      deleteTranslation={handleDeleteTranslation}
      useDocTranslationContext={useDocTranslationContext}
    />
  );
};

const ArticleTranslations = () => {
  const { activeTranslation, translations } = useDocTranslationContext();

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
