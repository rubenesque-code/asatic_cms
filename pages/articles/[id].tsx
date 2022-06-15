import { useState } from "react";
import type { NextPage } from "next";
import tw from "twin.macro";
import {
  CloudArrowUp,
  Gear,
  GitBranch,
  Translate,
  Trash,
  WarningCircle,
} from "phosphor-react";
import { v4 as generateUId } from "uuid";
import { toast } from "react-toastify";

import { createDocTranslationContext } from "^context/DocTranslationContext";
import { DocTopLevelControlsContext } from "^context/DocTopLevelControlsContext";

import { useDispatch, useSelector } from "^redux/hooks";

import {
  removeOne as deleteArticle,
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
  togglePublishStatus,
} from "^redux/state/articles";
import {
  addArticleRelation as addImageArticleRelation,
  removeArticleRelation as removeImageArticleRelation,
} from "^redux/state/images";
import {
  selectEntitiesByIds as selectAuthorsByIds,
  removeTranslation as removeAuthorTranslation,
} from "^redux/state/authors";
import { selectById as selectLanguageById } from "^redux/state/languages";

import useGetSubRouteId from "^hooks/useGetSubRouteId";
import useArticlePageTopControls from "^hooks/pages/useArticlePageTopControls";

import { Collection } from "^lib/firebase/firestore/collectionKeys";

import { capitalizeFirstLetter } from "^helpers/general";

import { ArticleTranslation } from "^types/article";

import Head from "^components/Head";
import QueryDatabase from "^components/DatabaseDataInit";
import DatePicker from "^components/date-picker";
import InlineTextEditor from "^components/editors/Inline";
import TipTapEditor from "^components/editors/tiptap";
import WithTooltip from "^components/WithTooltip";
import WithWarning from "^components/WithWarning";
import HandleRouteValidity from "^components/HandleRouteValidity";
import WithAddAuthor from "^components/WithAddAuthor";
import WithTags from "^components/WithTags";
// import NavMenu from "^components/header/NavMenu";
import DocControls from "^components/header/DocControls";
import WithProximityPopover from "^components/WithProximityPopover";
import PublishPopover from "^components/header/PublishPopover";
import WithTranslations from "^components/WithTranslations";
import LanguageError from "^components/LanguageError";

import { s_canvas } from "^styles/common";
import s_button from "^styles/button";
import { s_header } from "^styles/header";
import { s_menu } from "^styles/menus";
import SideBar from "^components/header/SideBar";
import WithEditDocAuthors from "^components/WithEditDocAuthors";

// * need default translation functionality? (none added in this file or redux/state)

// todo: need to be able to edit language name, tag text, authors, etc

// todo: sort out authors popover

// todo: show if anything saved without deployed; if deploy error, success
// todo: navmenu as sidebar
// todo: go over text colors. create abstractions
// todo: go over doctranslation context. Seems like duplication. Should be able to pass in translation generic?
// todo: firestore collections types can be better (use Matt Pocock youtube)
// todo: go over button css abstractions; could have an 'action' type button;
// todo: go over toasts. Probs don't need on add image, etc. If do, should be part of article onAddImage rather than `withAddImage` (those toasts taht refer to 'added to article'). Maybe overall positioning could be more prominent/or (e.g. on save success) some other widget showing feedback e.g. cursor, near actual button clicked.
// todo: articly styling doesn't seem right
// todo: leave page save warning

// todo: z-index fighting between `WithAddAuthor` and editor's menu; seems to work at time of writig this comment but wasn't before; seems random what happens. Also with sidebar overlay and date label.

// todo: handle image not there
// todo: handle no image in uploaded images too

// todo: nice green #2bbc8a

// todo: Nice to haves:
// todo: on delete, get redirected with generic "couldn't find article" message. A delete confirm message would be good
// todo: translation for dates
// todo: headers styling; publish/delete panel could be within a button

const ArticlePage: NextPage = () => {
  return (
    <>
      <Head />
      <QueryDatabase
        collections={[
          Collection.ARTICLES,
          Collection.AUTHORS,
          Collection.IMAGES,
          Collection.LANGUAGES,
          Collection.TAGS,
        ]}
      >
        <HandleRouteValidity docType="article">
          <PageContent />
        </HandleRouteValidity>
      </QueryDatabase>
    </>
  );
};

export default ArticlePage;

const { DocTranslationProvider, useDocTranslationContext } =
  createDocTranslationContext<ArticleTranslation>();

const useArticleData = () => {
  const articleId = useGetSubRouteId();
  const article = useSelector((state) => selectById(state, articleId))!;

  return article;
};

const PageContent = () => {
  const { translations } = useArticleData();
  return (
    <div css={[tw`min-h-screen flex flex-col`]}>
      <DocTranslationProvider translations={translations}>
        <>
          <Header />
          <div css={[s_canvas]}>
            <ArticleTranslations />
          </div>
        </>
      </DocTranslationProvider>
    </div>
  );
};

const Header = () => {
  const { handleSave, handleUndo, isChange, saveMutationData } =
    useArticlePageTopControls();

  const dispatch = useDispatch();
  const { id, publishInfo } = useArticleData();

  const handleDelete = () => {
    dispatch(deleteArticle({ id }));
    toast.success("Article deleted");
  };

  return (
    <DocTopLevelControlsContext
      isChange={isChange}
      save={{
        func: handleSave,
        saveMutationData,
      }}
      undo={{ func: handleUndo }}
    >
      <header css={[s_header.container]}>
        <div css={[tw`flex items-center gap-lg`]}>
          <div css={[s_header.spacing]}>
            {/* <NavMenu /> */}
            <SideBar />
            <PublishPopover
              isPublished={publishInfo.status === "published"}
              toggleStatus={() => dispatch(togglePublishStatus({ id }))}
            />
            <TranslationsPopover />
          </div>
          <div css={[s_header.spacing]}>
            <p css={[tw`text-sm text-gray-600`]}>
              {saveMutationData.isLoading ? (
                "saving..."
              ) : saveMutationData.isSuccess && !isChange ? (
                "saved"
              ) : saveMutationData.isError ? (
                <WithTooltip
                  text={{
                    header: "Save error",
                    body: "Try saving again. If the problem persists, please contact the site developer.",
                  }}
                >
                  <span css={[tw`text-red-warning flex gap-xxs items-center`]}>
                    <WarningCircle />
                    <span>save error</span>
                  </span>
                </WithTooltip>
              ) : null}
            </p>
          </div>
        </div>
        <div css={[tw`flex items-center gap-sm`]}>
          <div css={[tw`flex gap-sm`]}>
            <TagsPopover />
            <div css={[s_header.verticalBar]} />
            <DocControls />
          </div>
          <div css={[s_header.verticalBar]} />
          <Settings onDelete={handleDelete} />
          <div css={[s_header.verticalBar]} />
          <button css={[s_header.button]}>
            <CloudArrowUp />
          </button>
        </div>
      </header>
    </DocTopLevelControlsContext>
  );
};

const TranslationsPopover = () => {
  const dispatch = useDispatch();
  const { id, translations } = useArticleData();

  const { activeTranslation, setActiveTranslationId } =
    useDocTranslationContext();
  const activeTranslationLanguage = useSelector((state) =>
    selectLanguageById(state, activeTranslation.languageId)
  );

  const activeTranslationLanguageNameFormatted = activeTranslationLanguage
    ? capitalizeFirstLetter(activeTranslationLanguage.name)
    : null;

  return (
    <WithTranslations
      activeTranslationId={activeTranslation.id}
      docType="article"
      makeActive={(translationId) => setActiveTranslationId(translationId)}
      addToDoc={(languageId) => dispatch(addTranslation({ id, languageId }))}
      removeFromDoc={(translationId) => {
        if (translationId === activeTranslation.id) {
          const remainingTranslations = translations.filter(
            (t) => t.id !== translationId
          );
          const newActiveTranslationId = remainingTranslations[0].id;
          setActiveTranslationId(newActiveTranslationId);
        }
        dispatch(deleteTranslation({ id, translationId }));
        dispatch(removeAuthorTranslation({ id, translationId }));
      }}
      translations={translations}
    >
      <WithTooltip text="translations" placement="right">
        <button css={[tw`flex gap-xxxs items-center`]}>
          <span css={[s_button.subIcon, tw`text-sm -translate-y-1`]}>
            <Translate />
          </span>
          {activeTranslationLanguage ? (
            <span css={[tw`text-sm`]}>
              {activeTranslationLanguageNameFormatted}
            </span>
          ) : (
            <LanguageError tooltipPlacement="bottom">Error</LanguageError>
          )}
        </button>
      </WithTooltip>
    </WithTranslations>
  );
};

const TagsPopover = () => {
  const dispatch = useDispatch();
  const { id, tagIds } = useArticleData();

  return (
    <WithTags
      docTagIds={tagIds}
      docType="article"
      onRemoveFromDoc={(tagId) => dispatch(removeTag({ id, tagId }))}
      onSubmit={(tagId) => dispatch(addTag({ id, tagId }))}
    >
      <WithTooltip text="tags">
        <button css={[s_header.button]}>
          <GitBranch />
        </button>
      </WithTooltip>
    </WithTags>
  );
};

type SettingsProps = {
  onDelete: () => void;
};

const Settings = (props: SettingsProps) => {
  return (
    <WithProximityPopover panelContentElement={<SettingsPanel {...props} />}>
      <WithTooltip text="settings">
        <button css={[s_header.button]}>
          <Gear />
        </button>
      </WithTooltip>
    </WithProximityPopover>
  );
};
const SettingsPanel = ({ onDelete }: SettingsProps) => {
  return (
    <div css={[tw`py-xs bg-white rounded-md border min-w-[20ch]`]}>
      <WithWarning
        callbackToConfirm={onDelete}
        warningText={{
          heading: "Delete article",
          body: "Are you sure you want to delete this article?",
        }}
      >
        <button
          className="group"
          css={[
            s_menu.listItemText,
            tw`w-full text-left px-sm py-xs flex gap-sm items-center transition-colors ease-in-out duration-75`,
          ]}
        >
          <span css={[tw`group-hover:text-red-warning`]}>
            <Trash />
          </span>
          <span>Delete article</span>
        </button>
      </WithWarning>
    </div>
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
              <header css={[tw`flex flex-col gap-sm pb-md`]}>
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

  const { id: articleId, authorIds, translations } = useArticleData();
  const languageIds = translations.map((t) => t.languageId);
  const { activeTranslation } = useDocTranslationContext();

  return (
    <WithEditDocAuthors
      docActiveLanguageId={activeTranslation.languageId}
      docAuthorIds={authorIds}
      docLanguageIds={languageIds}
      // docType="article"
      onAddAuthorToDoc={(authorId) =>
        dispatch(addAuthor({ authorId, id: articleId }))
      }
      onRemoveAuthorFromDoc={(authorId) =>
        dispatch(removeAuthor({ authorId, id: articleId }))
      }
      // onSubmit={() => null}
    >
      <AuthorsLabel />
    </WithEditDocAuthors>
    /*     <WithAddAuthor
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
    </WithAddAuthor> */
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
      css={[tw`overflow-visible z-20 flex-grow`]}
      ref={setArticleBodyContainerNode}
      // * force a re-render when translation changes with key
      key={activeTranslation.id}
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
