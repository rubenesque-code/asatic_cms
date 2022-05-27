import type { NextPage } from "next";
import { ReactElement, useEffect } from "react";
import { useRouter } from "next/router";
import tw from "twin.macro";
import { TagSimple, XCircle } from "phosphor-react";

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
  removeAuthor,
  updateBody,
  addTag,
  removeTag,
} from "^redux/state/articles";
import { selectEntitiesByIds as selectTagsByIds } from "^redux/state/tags";
import {
  addArticleRelation as addImageArticleRelation,
  removeArticleRelation as removeImageArticleRelation,
} from "^redux/state/images";

import useGetSubRouteId from "^hooks/useGetSubRouteId";

import { ROUTES } from "^constants/routes";

import { ArticleTranslation } from "^types/article";

import Head from "^components/Head";
import QueryDataInit from "^components/QueryDataInit";
import Header from "^components/header";
import DatePicker from "^components/date-picker";
import AuthorPopover from "^components/AuthorPopover";
import InlineTextEditor from "^components/text-editor/Inline";
import TranslationsPanel from "^components/TranslationsPanel";
import RichTextEditor from "^components/text-editor/Rich";

import { s_canvas } from "^styles/common";
import AddTagPanel from "^components/AddTag";
import WithTooltip from "^components/WithTooltip";
import WithWarning from "^components/WithWarning";
import useArticlePageTopControls from "^hooks/pages/useArticlePageTopControls";
import { useFetchAuthorsQuery } from "^redux/services/authors";
import { useFetchImagesQuery } from "^redux/services/images";

// * need default translation functionality? (none added in this file or redux/state)

// todo: author panel: can delete if unused; can delete with warning if used; can edit and update (need to be able to update!)
// todo: translation for dates
// todo: go over button css abstractions; could have an 'action' type button;
// todo: format language data in uniform way (e.g. to lowercase; maybe capitalise)
// todo: save functionality
// todo: different english font with more weights. Title shouldn't be bold.
// todo: translation tab controls transition

// todo: images

// todo: need to be able to edit language name

const ArticlePage: NextPage = () => {
  //* fetches below won't be invoked if already have been
  const queryData = [
    useFetchArticlesQuery(),
    useFetchAuthorsQuery(),
    useFetchImagesQuery(),
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
      router.push("/" + ROUTES.ARTICLES);
    }, 850);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article]);

  if (article) {
    return children;
  }

  return (
    <div css={[tw`w-screen h-screen grid place-items-center`]}>
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
  const { handleSave, handleUndo, isChange, saveMutationData } =
    useArticlePageTopControls();
  // todo: add images functionality
  // todo: image label on bubble menu
  // todo: date

  return (
    <DocTopLevelControlsContext
      isChange={isChange}
      save={{
        func: handleSave,
        saveMutationData,
      }}
      undo={{ func: handleUndo }}
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
        <ArticleTags />
        <ArticleTranslationsPanel />
        <ArticleTranslations />
      </>
    </ArticleTranslationProvider>
  );
};

const ArticleTags = () => {
  const dispatch = useDispatch();

  const articleId = useArticleData().id;

  const { tagIds } = useArticleData();
  const tags = useSelector((state) => selectTagsByIds(state, tagIds));

  return (
    <div
      css={[
        tw`flex flex-col items-start gap-sm bg-white rounded-lg mb-md px-md py-sm shadow-md`,
      ]}
    >
      <div css={[tw`flex items-center gap-sm`]}>
        <WithTooltip text="article tags">
          <span css={[tw`text-lg`]}>
            <TagSimple />
          </span>
        </WithTooltip>
        <div css={[tw`flex gap-sm`]}>
          {tags.length ? (
            tags.map((tag) => (
              <div
                css={[tw`relative border rounded-lg py-0.5 px-2`]}
                className="group"
                key={tag.id}
              >
                <p>{tag.text}</p>
                <WithWarning
                  callbackToConfirm={() =>
                    dispatch(removeTag({ id: articleId, tagId: tag.id }))
                  }
                  warningText={{ heading: `Remove tag from article?` }}
                >
                  {({ isOpen: warningIsOpen }) => (
                    <WithTooltip
                      text="remove tag from article"
                      placement="top"
                      isDisabled={warningIsOpen}
                    >
                      <button
                        css={[
                          tw`group-hover:visible group-hover:opacity-100 invisible opacity-0 transition-opacity ease-in-out duration-75`,
                          tw`absolute right-0 top-0 translate-x-xxs -translate-y-1/2`,
                          tw`text-gray-600 p-xxs hover:bg-gray-100 active:bg-gray-200 rounded-full grid place-items-center`,
                        ]}
                        type="button"
                      >
                        <XCircle />
                      </button>
                    </WithTooltip>
                  )}
                </WithWarning>
              </div>
            ))
          ) : (
            <p>- no tags for article yet -</p>
          )}
        </div>
        <AddTagPanel
          docTagIds={tagIds}
          docType="article"
          onAddTag={(tagId) => dispatch(addTag({ id: articleId, tagId }))}
        />
      </div>
    </div>
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
            <article>
              <header css={[tw`flex flex-col gap-sm border-b pb-md`]}>
                <Date />
                <Title />
                <Author />
              </header>
              <Body />
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

const Title = () => {
  const dispatch = useDispatch();

  const { id } = useArticleData();

  const { activeTranslation } = useDocTranslationContext();

  const title = activeTranslation.title;

  return (
    <div css={[tw`text-3xl font-serif-eng font-medium`]}>
      <InlineTextEditor
        initialValue={title || ""}
        onUpdate={(title) =>
          dispatch(
            updateTitle({ id, title, translationId: activeTranslation.id })
          )
        }
        placeholder="Enter title here"
      />
    </div>
  );
};

const Author = () => {
  const dispatch = useDispatch();

  const { id: articleId, authorId } = useArticleData();

  const { activeTranslation } = useDocTranslationContext();

  return (
    <div css={[tw`text-2xl font-serif-eng font-medium`]}>
      <AuthorPopover
        activeLanguageId={activeTranslation.languageId}
        docAuthorId={authorId}
        docType="article"
        onAddAuthorToDoc={(authorId) =>
          dispatch(addAuthor({ id: articleId, authorId }))
        }
        onRemoveAuthorFromDoc={() => dispatch(removeAuthor({ id: articleId }))}
      />
    </div>
  );
};

const Body = () => {
  const dispatch = useDispatch();

  const { id: articleId } = useArticleData();
  const { activeTranslation } = useDocTranslationContext();

  /*   useUpdateImageRelations({
    articleId,
    translationBody: activeTranslation.body,
  }); */

  return (
    <section css={[tw`pt-md overflow-visible z-20`]}>
      <RichTextEditor
        initialContent={activeTranslation.body}
        onUpdate={(editorOutput) => {
          dispatch(
            updateBody({
              id: articleId,
              body: editorOutput,
              translationId: activeTranslation.id,
            })
          );
          //

          // dispatch(updateImagesRelatedArticleIds({ updatedImages }));
        }}
        onAddImageNode={(imageId) =>
          dispatch(addImageArticleRelation({ articleId, id: imageId }))
        }
        onRemoveImageNode={(imageId) =>
          dispatch(removeImageArticleRelation({ articleId, id: imageId }))
        }
        placeholder="Article starts here"
      />
    </section>
  );
};

// could also track added and removed image nodes - probably cleaner
/* const useUpdateImageRelations = ({
  articleId,
  translationBody,
}: {
  articleId: string;
  translationBody: ArticleTranslation["body"];
}) => {
  const dispatch = useDispatch();

  if (!translationBody) {
    return;
  }

  // * there's always `translationBody.content`
  const currentImagesIds = translationBody
    .content!.filter((node) => node.type === "image")
    .map((imageNode) => imageNode.attrs!.title);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const previousImagesIds = usePrevious(currentImagesIds) || [];

  const removedIds = arrayDivergence(previousImagesIds, currentImagesIds);
  const newIds = arrayDivergence(currentImagesIds, previousImagesIds);

  for (let i = 0; i < removedIds.length; i++) {
    const imageId = removedIds[i];
    dispatch(removeImageArticleRelation({ articleId, id: imageId }));
  }
  for (let i = 0; i < newIds.length; i++) {
    const imageId = newIds[i];
    dispatch(addImageArticleRelation({ articleId, id: imageId }));
  }
}; */
