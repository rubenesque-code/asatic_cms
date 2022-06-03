import { ReactElement, useState } from "react";
import type { NextPage } from "next";
import tw from "twin.macro";
import { TagSimple, XCircle } from "phosphor-react";

import { createDocTranslationContext } from "^context/DocTranslationContext";
import { DocTopLevelControlsContext } from "^context/DocTopLevelControlsContext";

import { useFetchArticlesQuery } from "^redux/services/articles";
import { useFetchTagsQuery } from "^redux/services/tags";
import { useFetchLanguagesQuery } from "^redux/services/languages";
import { useFetchAuthorsQuery } from "^redux/services/authors";
import { useFetchImagesQuery } from "^redux/services/images";

import { useDispatch, useSelector } from "^redux/hooks";

import {
  selectById,
  updatePublishDate,
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
import useArticlePageTopControls from "^hooks/pages/useArticlePageTopControls";

import { ArticleTranslation } from "^types/article";

import Head from "^components/Head";
import QueryDataInit from "^components/QueryDataInit";
import Header from "^components/header";
import DatePicker from "^components/date-picker";
import AuthorPopover from "^components/AuthorPopover";
import InlineTextEditor from "^components/editors/Inline";
import TranslationsPanel from "^components/TranslationsPanel";
import TipTapEditor from "^components/editors/tiptap";
import AddTagPanel from "^components/AddTag";
import WithTooltip from "^components/WithTooltip";
import WithWarning from "^components/WithWarning";
import HandleRouteValidity from "^components/HandleRouteValidity";

import { s_canvas } from "^styles/common";

// * need default translation functionality? (none added in this file or redux/state)

// todo: FUNCTIONALITY
// todo: - publish
// todo: - multiple authors
// todo: - edit language name
// todo: - delete article

// todo: z-index fighting. Use on hover/active? portals?
// todo: overall styling. Particularly 'tags'. Can leave until all functionality added.

// todo: translation for dates
// todo: go over button css abstractions; could have an 'action' type button;
// todo: format language data in uniform way (e.g. to lowercase; maybe capitalise)
// todo: different english font with more weights. Title shouldn't be bold.
// todo: translation tab controls transition

// todo: handle image not there
// todo: handle no image in uploaded images too

// todo: go over toasts. Probs don't need on add image, etc. If do, should be part of article onAddImage rather than `withAddImage` (those toasts taht refer to 'added to article'). Maybe overall positioning could be more prominent/or (e.g. on save success) some other widget showing feedback e.g. cursor, near actual button clicked.

// todo: nice green #2bbc8a

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
        <HandleRouteValidity docType="article">
          <PageContent />
        </HandleRouteValidity>
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
  const { handleSave, handleUndo, isChange, saveMutationData } =
    useArticlePageTopControls();

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
            <article css={[tw`flex flex-col`]}>
              <header css={[tw`flex flex-col gap-sm border-b pb-md`]}>
                <Date />
                <Title />
                <Authors />
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
  container: tw`bg-white pt-2.5xl pb-lg px-sm shadow-md flex-grow flex justify-center`,
};

const Date = () => {
  const dispatch = useDispatch();

  const article = useArticleData();
  const date = article.publishInfo.date;

  return (
    <DatePicker
      date={date}
      onChange={(date) => dispatch(updatePublishDate({ id: article.id, date }))}
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

const Authors = () => {
  const dispatch = useDispatch();

  const { id: articleId, authorIds } = useArticleData();

  const { activeTranslation } = useDocTranslationContext();

  return (
    <AuthorPopover
      activeLanguageId={activeTranslation.languageId}
      docAuthorIds={authorIds}
      // docAuthorId={authorId}
      docType="article"
      onAddAuthorToDoc={(authorId) =>
        dispatch(addAuthor({ id: articleId, authorId }))
      }
      onRemoveAuthorFromDoc={(authorId) =>
        dispatch(removeAuthor({ id: articleId, authorId }))
      }
    />
  );
};

const Body = () => {
  const [articleBodyContainerNode, setArticleBodyContainerNode] =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useState<any>(null);

  const articleBodyHeight = articleBodyContainerNode?.offsetHeight;

  const dispatch = useDispatch();

  const { id: articleId } = useArticleData();
  const { activeTranslation } = useDocTranslationContext();

  /*   useUpdateImageRelations({
    articleId,
    translationBody: activeTranslation.body,
  }); */
  // const articleBodyContainerRef = useRef<HTMLDivElement | null>(null)

  return (
    <section
      css={[tw`pt-md overflow-visible z-20 flex-grow`]}
      ref={setArticleBodyContainerNode}
    >
      {articleBodyHeight ? (
        <TipTapEditor
          height={articleBodyHeight}
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
      ) : null}
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
