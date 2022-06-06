import { ReactElement, useState } from "react";
import type { NextPage } from "next";
import tw from "twin.macro";
import { TagSimple, XCircle } from "phosphor-react";
import { v4 as generateUId } from "uuid";

import { createDocTranslationContext } from "^context/DocTranslationContext";
import { DocTopLevelControlsContext } from "^context/DocTopLevelControlsContext";

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
import { selectEntitiesByIds as selectAuthorsByIds } from "^redux/state/authors";

import useGetSubRouteId from "^hooks/useGetSubRouteId";
import useArticlePageTopControls from "^hooks/pages/useArticlePageTopControls";

import { ArticleTranslation } from "^types/article";

import Head from "^components/Head";
import QueryDataInit from "^components/QueryDataInit";
import Header from "^components/header";
import DatePicker from "^components/date-picker";
import InlineTextEditor from "^components/editors/Inline";
import TranslationsPanel from "^components/TranslationsPanel";
import TipTapEditor from "^components/editors/tiptap";
import AddTagPanel from "^components/AddTag";
import WithTooltip from "^components/WithTooltip";
import WithWarning from "^components/WithWarning";
import HandleRouteValidity from "^components/HandleRouteValidity";
import WithAddAuthor from "^components/WithAddAuthor";

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
  return (
    <>
      <Head />
      <QueryDataInit
        docTypes={["articles", "authors", "images", "languages", "tags"]}
      >
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

  return (
    <WithAddAuthor
      addAuthorToDoc={(authorId) =>
        dispatch(addAuthor({ authorId, id: articleId }))
      }
      authorIds={authorIds}
      docType="article"
      removeAuthorFromDoc={(authorId) =>
        dispatch(removeAuthor({ authorId, id: articleId }))
      }
    >
      <AuthorsLabel />
    </WithAddAuthor>
  );
};

const AuthorsLabel = () => {
  const { authorIds } = useArticleData();
  const { activeTranslation } = useDocTranslationContext();

  const docAuthors = useSelector((state) =>
    selectAuthorsByIds(state, authorIds)
  );

  const isAuthor = Boolean(docAuthors.length);

  const docAuthorsTranslationData = docAuthors.map((author) => {
    const translationForActiveLanguage = author.translations.find(
      (t) => t.languageId === activeTranslation.languageId
    );

    return {
      id: generateUId(),
      translationForActiveLanguage,
    };
  });

  return (
    <span css={[tw`text-xl w-full`]}>
      {!isAuthor ? (
        <span css={[tw`text-gray-placeholder`]}>Add author (optional)</span>
      ) : (
        docAuthorsTranslationData.map((t, i) => {
          const isAFollowingAuthor = i < docAuthorsTranslationData.length - 1;
          const docAuthorNameForActiveLangugage =
            t.translationForActiveLanguage?.name;

          return (
            <span
              css={[
                docAuthorNameForActiveLangugage
                  ? tw`font-serif-eng`
                  : tw`text-red-warning uppercase text-xs border border-red-warning rounded-sm mr-sm py-0.5 px-1 font-sans whitespace-nowrap`,
              ]}
              key={t.id}
            >
              {docAuthorNameForActiveLangugage
                ? `${docAuthorNameForActiveLangugage}${
                    isAFollowingAuthor ? ", " : ""
                  }`
                : `Author translation missing`}
            </span>
          );
        })
      )}
    </span>
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
