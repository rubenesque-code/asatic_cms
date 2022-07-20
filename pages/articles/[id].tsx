import { ReactElement } from "react";
import type { NextPage } from "next";
import tw from "twin.macro";
import { Gear, GitBranch, Translate, Trash } from "phosphor-react";
import { toast } from "react-toastify";

import { useDispatch, useSelector } from "^redux/hooks";
import { selectById, updatePublishDate } from "^redux/state/articles";
import { selectById as selectAuthorById } from "^redux/state/authors";
import { selectById as selectLanguageById } from "^redux/state/languages";

import {
  SelectArticleTranslationProvider as SelectTranslationProvider,
  useSelectArticleTranslationContext as useSelectTranslationContext,
} from "^context/SelectArticleTranslationContext";
import {
  ArticleTranslationWithActionsProvider as ArticleTranslationProvider,
  useArticleTranslationWithActionsContext as useTranslationContext,
} from "^context/ArticleTranslationWithActionsContext.tsx";
import { ArticleProvider, useArticleContext } from "^context/ArticleContext";

import useGetSubRouteId from "^hooks/useGetSubRouteId";
import useArticlePageTopControls from "^hooks/pages/useArticlePageTopControls";

import { Collection } from "^lib/firebase/firestore/collectionKeys";

import { capitalizeFirstLetter } from "^helpers/general";

import Head from "^components/Head";
import QueryDatabase from "^components/QueryDatabase";
import DatePicker from "^components/date-picker";
import InlineTextEditor from "^components/editors/Inline";
import TipTapEditor from "^components/editors/tiptap/ArticleEditor";
import WithTooltip from "^components/WithTooltip";
import WithWarning from "^components/WithWarning";
import HandleRouteValidity from "^components/HandleRouteValidity";
import WithTags from "^components/WithTags";
import WithProximityPopover from "^components/WithProximityPopover";
import PublishPopover from "^components/header/PublishPopover";
import WithTranslations from "^components/WithTranslations";
import LanguageError from "^components/LanguageError";
import WithEditDocAuthors from "^components/WithEditDocAuthors";
import SaveTextUI from "^components/header/SaveTextUI";
import EditCanvas from "^components/EditCanvas";
import HeaderGeneric from "^components/header/HeaderGeneric";
import UndoButtonUI from "^components/header/UndoButtonUI";
import SaveButtonUI from "^components/header/SaveButtonUI";
import HeaderIconButton from "^components/header/IconButton";
import MissingText from "^components/MissingText";

import s_button from "^styles/button";
import { s_header } from "^styles/header";
import { s_menu } from "^styles/menus";
import { s_popover } from "^styles/popover";
import { useMeasure } from "react-use";

// todo: title text in input not changing when change translation
// todo: next image in tiptap editor?

// todo: copy and paste translation
// todo: go over text colors. create abstractions
// todo: go over button css abstractions; could have an 'action' type button;
// todo: z-index fighting between `WithAddAuthor` and editor's menu; seems to work at time of writig this comment but wasn't before; seems random what happens. Also with sidebar overlay and date label.

// todo: firestore collections types can be better (use Matt Pocock youtube)
// todo: go over toasts. Probs don't need on add image, etc. If do, should be part of article onAddImage rather than `withAddImage` (those toasts taht refer to 'added to article'). Maybe overall positioning could be more prominent/or (e.g. on save success) some other widget showing feedback e.g. cursor, near actual button clicked.

// todo: handle image not there
// todo: handle no image in uploaded images too

// todo: nice green #2bbc8a

// todo| COME BACK TO
// todo: article styling. Do on front end first
// todo: would expect to be able to scroll anywhere with a white background
// todo: need default translation functionality? (none added in this file or redux/state)
// todo: show if anything saved without deployed; if deploy error, success
// todo: since article body translation and article authors are independent and both rely on the same languages, should have languages as seperate field

// todo: Nice to haves:
// todo: on delete, get redirected with generic "couldn't find article" message. A delete confirm message would be good
// todo: translation for dates

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

const PageContent = () => {
  const articleId = useGetSubRouteId();
  const article = useSelector((state) => selectById(state, articleId))!;

  return (
    <div css={[tw`h-screen overflow-hidden flex flex-col`]}>
      <ArticleProvider article={article}>
        <SelectTranslationProvider translations={article.translations}>
          <>
            <Header />
            <Main />
          </>
        </SelectTranslationProvider>
      </ArticleProvider>
    </div>
  );
};

const Header = () => {
  const { handleSave, handleUndo, isChange, saveMutationData } =
    useArticlePageTopControls();

  const [{ publishInfo }, { togglePublishStatus }] = useArticleContext();

  return (
    <HeaderGeneric confirmBeforeLeavePage={isChange}>
      <div css={[tw`flex justify-between items-center`]}>
        <div css={[tw`flex items-center gap-lg`]}>
          <div css={[tw`flex items-center gap-sm`]}>
            <PublishPopover
              isPublished={publishInfo.status === "published"}
              toggleStatus={togglePublishStatus}
            />
            <TranslationsPopover />
          </div>
          <SaveTextUI isChange={isChange} saveMutationData={saveMutationData} />
        </div>
        <div css={[tw`flex items-center gap-sm`]}>
          <TagsPopover />
          <div css={[s_header.verticalBar]} />
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
          <Settings />
          <div css={[s_header.verticalBar]} />
        </div>
      </div>
    </HeaderGeneric>
  );
};

const TranslationsPopover = () => {
  const [{ translations }, { addTranslation, deleteTranslation }] =
    useArticleContext();
  const [{ id: activeTranslationId }, { updateActiveTranslation }] =
    useSelectTranslationContext();

  const handleDeleteTranslation = (translationToDeleteId: string) => {
    const translationToDeleteIsActive =
      translationToDeleteId === activeTranslationId;

    if (translationToDeleteIsActive) {
      const remainingTranslations = translations.filter(
        (t) => t.id !== translationToDeleteId
      );
      const newActiveTranslationId = remainingTranslations[0].id;
      updateActiveTranslation(newActiveTranslationId);
    }

    deleteTranslation({ translationId: translationToDeleteId });
  };

  return (
    <WithTranslations
      activeTranslationId={activeTranslationId}
      docType="article"
      updateActiveTranslation={updateActiveTranslation}
      addToDoc={(languageId) => addTranslation({ languageId })}
      removeFromDoc={handleDeleteTranslation}
      translations={translations}
    >
      <TranslationsPopoverLabel />
    </WithTranslations>
  );
};

const TranslationsPopoverLabel = () => {
  const [activeTranslation] = useSelectTranslationContext();

  const activeTranslationLanguage = useSelector((state) =>
    selectLanguageById(state, activeTranslation.languageId)
  );

  const activeTranslationLanguageNameFormatted = activeTranslationLanguage
    ? capitalizeFirstLetter(activeTranslationLanguage.name)
    : null;

  return (
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
  );
};

const TagsPopover = () => {
  const [{ tagIds }, { removeTag, addTag }] = useArticleContext();

  return (
    <WithTags
      docTagIds={tagIds}
      docType="article"
      onRemoveFromDoc={(tagId) => removeTag({ tagId })}
      onSubmit={(tagId) => addTag({ tagId })}
    >
      <HeaderIconButton tooltipText="tags">
        <GitBranch />
      </HeaderIconButton>
    </WithTags>
  );
};

const Settings = () => {
  return (
    <WithProximityPopover panelContentElement={<SettingsPanel />}>
      <HeaderIconButton tooltipText="settings">
        <Gear />
      </HeaderIconButton>
    </WithProximityPopover>
  );
};
const SettingsPanel = () => {
  const [, { deleteArticleFromStoreAndDb }] = useArticleContext();

  const handleDelete = () => {
    // todo: how to handle this all together properly? Not handling doc deletion error.
    // todo: handle error
    deleteArticleFromStoreAndDb();
    toast.success("Article deleted");
  };

  return (
    <div css={[s_popover.panelContainer, tw`py-xs min-w-[25ch]`]}>
      <WithWarning
        callbackToConfirm={handleDelete}
        warningText={{
          heading: "Delete article",
          body: "Are you sure you want? This can't be undone.",
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

const Main = () => {
  return (
    <EditCanvas>
      <main css={[tw`max-w-[645px] m-auto h-full`]}>
        <Article />
      </main>
    </EditCanvas>
  );
};

const Article = () => {
  const [{ id }] = useArticleContext();
  const [translation] = useSelectTranslationContext();

  return (
    <ArticleTranslationProvider articleId={id} translation={translation}>
      <ArticleUI />
    </ArticleTranslationProvider>
  );
};

const ArticleUI = () => (
  <article css={[tw`h-full flex flex-col`]}>
    <header css={[tw`flex flex-col gap-sm pt-lg pb-md border-b`]}>
      <Date />
      <Title />
      <Authors />
    </header>
    <Body />
  </article>
);

const Date = () => {
  const dispatch = useDispatch();

  const [{ id, publishInfo }] = useArticleContext();
  const date = publishInfo.date;

  return (
    <DatePicker
      date={date}
      onChange={(date) => dispatch(updatePublishDate({ id, date }))}
    />
  );
};

const Title = () => {
  const [{ id: translationId, title }, { updateTitle }] =
    useTranslationContext();

  return (
    <div css={[tw`text-3xl font-serif-eng font-medium`]}>
      <InlineTextEditor
        injectedValue={title || ""}
        onUpdate={(title) => updateTitle({ title })}
        placeholder="Enter title here"
        key={translationId}
      />
    </div>
  );
};

const Authors = () => {
  const [{ authorIds, translations }, { addAuthor, removeAuthor }] =
    useArticleContext();
  const languageIds = translations.map((t) => t.languageId);

  const [{ languageId }] = useSelectTranslationContext();

  return (
    <WithEditDocAuthors
      docActiveLanguageId={languageId}
      docAuthorIds={authorIds}
      docLanguageIds={languageIds}
      onAddAuthorToDoc={(authorId) => addAuthor({ authorId })}
      onRemoveAuthorFromDoc={(authorId) => removeAuthor({ authorId })}
    >
      <AuthorsLabel />
    </WithEditDocAuthors>
  );
};

const AuthorsLabel = () => {
  const [{ authorIds }] = useArticleContext();

  const isAuthor = Boolean(authorIds.length);

  return (
    <WithTooltip text="edit authors" placement="bottom-start">
      <span css={[tw`text-xl w-full`]}>
        {!isAuthor ? (
          <AuthorsLabelEmptyUI />
        ) : (
          <div css={[tw`flex gap-xs`]}>
            {authorIds.map((id, i) => (
              <AuthorsLabelAuthor
                authorId={id}
                isAFollowingAuthor={i < authorIds.length - 1}
                key={id}
              />
            ))}
          </div>
        )}
      </span>
    </WithTooltip>
  );
};

const AuthorsLabelEmptyUI = () => (
  <span css={[tw`text-gray-placeholder`]}>Add author (optional)</span>
);

const AuthorsLabelAuthor = ({
  authorId,
  isAFollowingAuthor,
}: {
  authorId: string;
  isAFollowingAuthor: boolean;
}) => {
  // todo: handle no author
  const author = useSelector((state) => selectAuthorById(state, authorId))!;
  const { translations } = author;

  const [{ languageId }] = useSelectTranslationContext();

  const translation = translations.find((t) => t.languageId === languageId);

  const name = translation?.name;

  return (
    <AuthorsLabelAuthorUI
      isAFollowingAuthor={isAFollowingAuthor}
      text={
        name ? (
          <AuthorsLabelText text={name} />
        ) : (
          <AuthorsLabelTranslationMissing />
        )
      }
    />
  );
};

const AuthorsLabelAuthorUI = ({
  isAFollowingAuthor,
  text,
}: {
  isAFollowingAuthor: boolean;
  text: ReactElement;
}) => (
  <span css={[tw`flex`]}>
    {text}
    {isAFollowingAuthor ? "," : null}
  </span>
);

const AuthorsLabelText = ({ text }: { text: string }) => {
  return <span css={[tw`font-serif-eng text-gray-700`]}>{text}</span>;
};

const AuthorsLabelTranslationMissing = () => {
  return (
    <span css={[tw`flex items-center gap-sm`]}>
      <span css={[tw`text-gray-placeholder`]}>author...</span>
      <MissingText tooltipText="Missing author translation" />
    </span>
  );
};

const Body = () => {
  const [containerRef, { height: articleHeight, width: articleWidth }] =
    useMeasure<HTMLDivElement>();

  const [{ body, id: translationId }, { updateBody }] = useTranslationContext();
  console.log("body:", body);

  return (
    <>
      <div css={[tw`h-md`]} />
      <div css={[tw`overflow-visible z-20 flex-grow`]} ref={containerRef}>
        {articleWidth && articleHeight ? (
          <TipTapEditor
            containerWidth={articleWidth}
            height={articleHeight}
            initialContent={body.length ? body : undefined}
            onUpdate={(body) => updateBody({ body })}
            placeholder="Article starts here"
            key={translationId}
          />
        ) : null}
      </div>
    </>
  );
};
