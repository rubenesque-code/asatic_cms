import type { NextPage } from "next";
import { ReactElement, useEffect, useState } from "react";
import tw from "twin.macro";
import {
  Gear,
  GitBranch,
  PlusCircle,
  Translate,
  Trash as TrashIcon,
  Article as ArticleIcon,
  Image as ImageIcon,
  YoutubeLogo as YoutubeLogoIcon,
  Copy as CopyIcon,
  ArrowSquareOut as ArrowSquareOutIcon,
} from "phosphor-react";
import { toast } from "react-toastify";
import { useMeasure } from "react-use";
import { CopyToClipboard } from "react-copy-to-clipboard";

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

import {
  capitalizeFirstLetter,
  mapIds,
  orderSortableComponents2,
} from "^helpers/general";

import Head from "^components/Head";
import QueryDatabase from "^components/QueryDatabase";
import DatePicker from "^components/date-picker";
import InlineTextEditor from "^components/editors/Inline";
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
import HeaderGeneric from "^components/header/HeaderGeneric";
import UndoButtonUI from "^components/header/UndoButtonUI";
import SaveButtonUI from "^components/header/SaveButtonUI";
import HeaderIconButton from "^components/header/IconButton";
import MissingText from "^components/MissingText";

import s_button from "^styles/button";
import { s_header } from "^styles/header";
import { s_menu } from "^styles/menus";
import { s_popover } from "^styles/popover";
import { ArticleTranslationBodySection } from "^types/article";
import s_transition from "^styles/transition";
import EmptySectionsUI from "^components/pages/article/EmptySectionsUI";
import AddItemButton from "^components/buttons/AddItem";
import ArticleEditor2 from "^components/editors/tiptap/ArticleEditor2";
import DndSortableContext from "^components/dndkit/DndSortableContext";
import DndSortableElement from "^components/dndkit/DndSortableElement";
import {
  ContentMenuButton,
  ContentMenuContainer,
  ContentMenuVerticalBar,
} from "^components/menus/Content";
import {
  ArticleTranslationBodyTextSectionProvider as TextSectionProvider,
  useArticleTranslationBodyTextSectionContext as useTextSectionContext,
} from "^context/ArticleTranslationBodyTextSectionContext";
import {
  ArticleTranslationBodyImageSectionProvider,
  useArticleTranslationBodyImageSectionContext as useImageSectionContext,
} from "^context/ArticleTranslationBodyImageSectionContext";
import ImageMenuUI from "^components/menus/Image";
import WithAddDocImage from "^components/WithAddDocImage";
import ResizeImage from "^components/resize/Image";
import ImageWrapper from "^components/images/Wrapper";
import WithAddYoutubeVideoInitial from "^components/WithAddYoutubeVideo";
import {
  ArticleTranslationBodyVideoSectionProvider,
  useArticleTranslationBodyVideoSectionContext as useVideoSectionContext,
} from "^context/ArticleTranslationBodyVideoSectionContext";
import {
  getYoutubeEmbedUrlFromId,
  getYoutubeWatchUrlFromId,
} from "^helpers/youtube";
import MeasureWidth from "^components/MeasureWidth";
import ContainerHover from "^components/ContainerHover";
import MeasureHeight from "^components/MeasureHeight";
import Link from "next/link";

// todo: menu stylings

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
// todo: copy and paste translation
// todo: check youtube video exists by id

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
            <TrashIcon />
          </span>
          <span>Delete article</span>
        </button>
      </WithWarning>
    </div>
  );
};

const Main = () => {
  return (
    <MeasureHeight
      styles={tw`h-full grid place-items-center bg-gray-50 border-t-2 border-gray-200`}
    >
      {(containerHeight) =>
        containerHeight ? (
          <main
            css={[
              tw`w-[95%] max-w-[720px] pl-lg pr-xl overflow-y-auto overflow-x-hidden bg-white shadow-md`,
            ]}
            style={{ height: containerHeight * 0.95 }}
          >
            <Article />
          </main>
        ) : null
      }
    </MeasureHeight>
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
    <header css={[tw`flex flex-col items-start gap-sm pt-lg pb-md border-b`]}>
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
      <div css={[tw`text-xl`]}>
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
      </div>
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

  const [{ body }] = useTranslationContext();

  const isContent = body.length;

  return (
    <>
      <div css={[tw`h-md`]} />
      <div css={[tw`overflow-visible z-20 flex-grow`]} ref={containerRef}>
        {articleWidth && articleHeight ? (
          <>
            {isContent ? (
              <BodySections />
            ) : (
              <EmptySectionsUI
                addSectionButton={
                  <WithAddSection sectionToAddIndex={0}>
                    <AddItemButton>Add section</AddItemButton>
                  </WithAddSection>
                }
              />
            )}
          </>
        ) : null}
      </div>
    </>
  );
};

const BodySections = () => {
  const [sectionHoveredIndex, setSectionHoveredIndex] = useState<null | number>(
    null
  );
  const setSectionHoveredToNull = () => setSectionHoveredIndex(null);

  const [{ body }, { reorderBody }] = useTranslationContext();

  const sectionsOrdered = orderSortableComponents2(body);
  const sectiondsOrderedById = mapIds(sectionsOrdered);

  return (
    <>
      <AddSectionMenu sectionToAddIndex={0} show={sectionHoveredIndex === 0} />
      <DndSortableContext
        elementIds={sectiondsOrderedById}
        onReorder={reorderBody}
      >
        {sectionsOrdered.map((section, i) => (
          <DndSortableElement elementId={section.id} key={section.id}>
            <BodySectionContainerUI
              addSectionMenu={
                <AddSectionMenu
                  show={
                    sectionHoveredIndex === i || sectionHoveredIndex === i + 1
                  }
                  sectionToAddIndex={i + 1}
                />
              }
              sectionMenu={
                <SectionMenu
                  sectionId={section.id}
                  show={sectionHoveredIndex === i}
                />
              }
              onMouseEnter={() => setSectionHoveredIndex(i)}
              onMouseLeave={setSectionHoveredToNull}
              key={section.id}
            >
              <BodySectionSwitch section={section} />
            </BodySectionContainerUI>
          </DndSortableElement>
        ))}
      </DndSortableContext>
    </>
  );
};

const BodySectionContainerUI = ({
  children,
  addSectionMenu,
  sectionMenu,
  ...hoverHandlers
}: {
  addSectionMenu: ReactElement;
  children: ReactElement;
  sectionMenu: ReactElement;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) => (
  <div css={[tw`relative`]} {...hoverHandlers}>
    {children}
    {sectionMenu}
    {addSectionMenu}
  </div>
);

const AddSectionMenu = ({
  sectionToAddIndex,
  show,
}: {
  sectionToAddIndex: number;
  show: boolean;
}) => {
  return (
    <AddSectionMenuUI
      addSectionButton={
        <WithAddSection sectionToAddIndex={sectionToAddIndex}>
          <AddSectionButtonUI />
        </WithAddSection>
      }
      show={show}
    />
  );
};

const AddSectionMenuUI = ({
  addSectionButton,
  show,
}: {
  addSectionButton: ReactElement;
  show: boolean;
}) => (
  <div
    css={[
      tw`relative z-30 hover:z-50 h-[20px]`,
      s_transition.toggleVisiblity(show),
      tw`opacity-40 hover:opacity-100 hover:visible`,
    ]}
  >
    <div
      css={[tw`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`]}
    >
      {addSectionButton}
    </div>
  </div>
);

const AddSectionButtonUI = () => (
  <WithTooltip text="add section here" type="action">
    <button
      css={[
        // s_editorMenu.button.button,
        tw`rounded-full bg-transparent hover:bg-white text-gray-400 hover:scale-125 transition-all ease-in duration-75 hover:text-green-active`,
      ]}
      type="button"
    >
      <PlusCircle />
    </button>
  </WithTooltip>
);

const WithAddSection = ({
  children,
  sectionToAddIndex,
}: {
  sectionToAddIndex: number;
  children: ReactElement;
}) => {
  const [, { addBodySection }] = useTranslationContext();

  const addImage = () =>
    addBodySection({ index: sectionToAddIndex, type: "image" });
  const addText = () =>
    addBodySection({ index: sectionToAddIndex, type: "text" });
  const addVideo = () =>
    addBodySection({ index: sectionToAddIndex, type: "video" });

  return (
    <WithProximityPopover
      panelContentElement={({ close: closePanel }) => (
        <AddSectionPanelUI
          addImage={() => {
            addImage();
            closePanel();
          }}
          addText={() => {
            addText();
            closePanel();
          }}
          addVideo={() => {
            addVideo();
            closePanel();
          }}
        />
      )}
      placement="top"
    >
      {children}
    </WithProximityPopover>
  );
};

const AddSectionPanelUI = ({
  addImage,
  addText,
  addVideo,
}: {
  addText: () => void;
  addImage: () => void;
  addVideo: () => void;
}) => (
  <div
    css={[
      tw`px-sm py-xs flex items-center gap-md bg-white rounded-md shadow-md border`,
    ]}
  >
    <button type="button" onClick={addText}>
      <ArticleIcon />
    </button>
    <button type="button" onClick={addImage}>
      <ImageIcon />
    </button>
    <button type="button" onClick={addVideo}>
      <YoutubeLogoIcon />
    </button>
  </div>
);

const BodySectionSwitch = ({
  section,
}: {
  section: ArticleTranslationBodySection;
}) => {
  const { type } = section;
  const [{ id: articleId }] = useArticleContext();
  const [{ id: translationId }] = useTranslationContext();

  const ids = {
    articleId,
    translationId,
  };

  if (type === "text") {
    return (
      <TextSectionProvider {...ids} section={section}>
        <TextSection />
      </TextSectionProvider>
    );
  }
  if (type === "image") {
    return (
      <ArticleTranslationBodyImageSectionProvider {...ids} section={section}>
        <ImageSection />
      </ArticleTranslationBodyImageSectionProvider>
    );
  }
  if (type === "video") {
    return (
      <ArticleTranslationBodyVideoSectionProvider {...ids} section={section}>
        <VideoSection />
      </ArticleTranslationBodyVideoSectionProvider>
    );
  }

  throw new Error("invalid section type");
};

const SectionMenu = ({
  sectionId,
  show,
}: {
  sectionId: string;
  show: boolean;
}) => {
  // const sectionIsHovered = useHoverContext();
  const [, { deleteBodySection }] = useTranslationContext();

  const deleteSection = () => deleteBodySection({ sectionId });

  return <SectionMenuUI deleteSection={deleteSection} show={show} />;
};

const SectionMenuUI = ({
  deleteSection,
  show,
}: {
  deleteSection: () => void;
  show: boolean;
}) => (
  <ContentMenuContainer containerStyles={tw`top-0 right-0`} show={show}>
    <>
      <WithWarning
        callbackToConfirm={deleteSection}
        warningText="Delete section?"
        type="moderate"
      >
        <ContentMenuButton
          tooltipProps={{ text: "delete section", type: "action" }}
        >
          <TrashIcon />
        </ContentMenuButton>
      </WithWarning>
    </>
  </ContentMenuContainer>
);

const TextSection = () => {
  const [{ content }, { updateText }] = useTextSectionContext();

  return (
    <TextSectionUI
      editor={
        <ArticleEditor2
          initialContent={content || undefined}
          onUpdate={(content) => updateText({ content })}
          placeholder="text section"
        />
      }
      isContent={Boolean(content)}
    />
  );
};

const TextSectionUI = ({
  editor,
  isContent,
}: {
  isContent: boolean;
  editor: ReactElement;
}) => <div css={[!isContent && tw`border-2 border-dashed`]}>{editor}</div>;

const ImageSection = () => {
  const [
    {
      image: { imageId },
    },
    { updateSrc },
  ] = useImageSectionContext();

  return imageId ? (
    <ImageSectionUI />
  ) : (
    <ImageSectionEmptyUI addImage={(imageId) => updateSrc({ imageId })} />
  );
};

const ImageSectionUI = () => (
  <ContainerHover>
    {(containerIsHovered) => (
      <>
        <div css={[tw`relative`]}>
          <ImageMenu containerIsHovered={containerIsHovered} />
          <ImageSectionImage />
          <ImageCaption />
        </div>
      </>
    )}
  </ContainerHover>
);

const ImageSectionEmptyUI = ({
  addImage,
}: {
  addImage: (imageId: string) => void;
}) => (
  <div css={[tw`h-[200px] grid place-items-center border-2 border-dashed`]}>
    <div css={[tw`text-center`]}>
      <h4 css={[tw`font-medium`]}>Image section</h4>
      <p css={[tw`text-gray-700 text-sm mt-xs`]}>No image</p>
      <div css={[tw`mt-md`]}>
        <WithAddDocImage onAddImage={addImage}>
          <AddItemButton>Add image</AddItemButton>
        </WithAddDocImage>
      </div>
    </div>
  </div>
);

const ImageMenu = ({ containerIsHovered }: { containerIsHovered: boolean }) => {
  const [
    {
      image: {
        style: { vertPosition },
      },
    },
    { updateSrc, updateVertPosition },
  ] = useImageSectionContext();

  const canFocusLower = vertPosition < 100;
  const canFocusHigher = vertPosition > 0;

  const positionChangeAmount = 10;

  const focusHigher = () => {
    if (!canFocusHigher) {
      return;
    }
    const updatedPosition = vertPosition - positionChangeAmount;
    updateVertPosition({ vertPosition: updatedPosition });
  };
  const focusLower = () => {
    if (!canFocusLower) {
      return;
    }
    const updatedPosition = vertPosition + positionChangeAmount;
    updateVertPosition({ vertPosition: updatedPosition });
  };

  return (
    <ImageMenuUI
      canFocusHigher={canFocusHigher}
      canFocusLower={canFocusLower}
      focusHigher={focusHigher}
      focusLower={focusLower}
      show={containerIsHovered}
      updateImageSrc={(imageId) => updateSrc({ imageId })}
      containerStyles={tw`left-0 top-0`}
    />
  );
};

const ImageSectionImage = () => {
  const [
    {
      image: {
        imageId,
        style: { aspectRatio, vertPosition },
      },
    },
    { updateAspectRatio },
  ] = useImageSectionContext();

  return (
    <ResizeImage
      aspectRatio={aspectRatio}
      onAspectRatioChange={(aspectRatio) => {
        updateAspectRatio({ aspectRatio });
      }}
    >
      <ImageSectionImageUI
        image={
          <ImageWrapper
            imgId={imageId!}
            objectFit="cover"
            vertPosition={vertPosition}
          />
        }
      />
    </ResizeImage>
  );
};

const ImageSectionImageUI = ({ image }: { image: ReactElement }) => (
  <div css={[tw`relative h-full w-full`]}>{image}</div>
);

const ImageCaption = () => {
  const [
    {
      image: { caption },
    },
    { updateCaption },
  ] = useImageSectionContext();

  return (
    <CaptionUI
      editor={
        <InlineTextEditor
          injectedValue={caption}
          onUpdate={(caption) => updateCaption({ caption })}
          placeholder="optional caption"
        />
      }
    />
  );
};

const CaptionUI = ({ editor }: { editor: ReactElement }) => (
  <div css={[tw`mt-xs border-l border-gray-500 pl-xs text-gray-700`]}>
    {editor}
  </div>
);

const VideoSection = () => {
  const [
    {
      video: { id: videoId },
    },
  ] = useVideoSectionContext();

  return videoId ? <VideoSectionUI /> : <VideoSectionEmptyUI />;
};

const VideoSectionUI = () => (
  <div>
    <div css={[tw`relative`]}>
      <ContainerHover>
        {(isHovered) => (
          <>
            <div css={[tw`absolute left-0 top-0 w-full h-full z-10`]}>
              <VideoMenuUI show={isHovered} />
            </div>
            <VideoSectionVideo />
          </>
        )}
      </ContainerHover>
    </div>
    <VideoCaption />
  </div>
);

const VideoSectionEmptyUI = () => (
  <div css={[tw`h-[200px] grid place-items-center border-2 border-dashed`]}>
    <div css={[tw`text-center `]}>
      <h4 css={[tw`font-medium`]}>Video section</h4>
      <p css={[tw`text-gray-700 text-sm mt-xs`]}>No video</p>
      <div css={[tw`mt-md`]}>
        <WithAddYoutubeVideo>
          <AddItemButton>Add video</AddItemButton>
        </WithAddYoutubeVideo>
      </div>
    </div>
  </div>
);

const WithAddYoutubeVideo = ({ children }: { children: ReactElement }) => {
  const [, { updateSrc }] = useVideoSectionContext();

  return (
    <WithAddYoutubeVideoInitial
      onAddVideo={(videoId) => updateSrc({ videoId })}
    >
      {children}
    </WithAddYoutubeVideoInitial>
  );
};

const VideoSectionVideo = () => {
  const [
    {
      video: { id },
    },
  ] = useVideoSectionContext();

  const url = getYoutubeEmbedUrlFromId(id!);

  return (
    <MeasureWidth>
      {(width) =>
        width ? (
          <VideoSectionVideoUI
            height={(width * 9) / 16}
            src={url}
            width={width}
          />
        ) : null
      }
    </MeasureWidth>
  );
};

const VideoSectionVideoUI = ({
  height,
  src,
  width,
}: {
  width: number;
  height: number;
  src: string;
}) => (
  <div>
    <iframe
      width={width}
      height={height}
      src={src}
      frameBorder="0"
      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  </div>
);

const VideoMenuUI = ({ show }: { show: boolean }) => (
  <ContentMenuContainer show={show}>
    <WithAddYoutubeVideo>
      <ContentMenuButton tooltipProps={{ text: "change video" }}>
        <YoutubeLogoIcon />
      </ContentMenuButton>
    </WithAddYoutubeVideo>
    <ContentMenuVerticalBar />
    <VideoMenuCopyButton />
    <VideoMenuWatchInYoutubeButton />
  </ContentMenuContainer>
);

const VideoMenuCopyButton = () => {
  const [wasJustCopied, setWasJustCopied] = useState(false);

  useEffect(() => {
    if (wasJustCopied) {
      setTimeout(() => {
        setWasJustCopied(false);
      }, 3000);
    }
  }, [wasJustCopied]);

  const [
    {
      video: { id },
    },
  ] = useVideoSectionContext();

  const url = getYoutubeWatchUrlFromId(id!);

  const onCopy = () => {
    setWasJustCopied(true);
  };

  return (
    <VideoMenuCopyButtonUI
      onCopy={onCopy}
      url={url}
      wasJustCopied={wasJustCopied}
    />
  );
};

const VideoMenuCopyButtonUI = ({
  onCopy,
  url,
  wasJustCopied,
}: {
  onCopy: () => void;
  url: string | null;
  wasJustCopied: boolean;
}) => (
  <CopyToClipboard onCopy={onCopy} text={url || ""} options={{}}>
    <div css={[tw`relative`]}>
      <ContentMenuButton tooltipProps={{ text: "copy youtube url" }}>
        <CopyIcon />
      </ContentMenuButton>
      <div
        css={[
          tw`absolute right-0 -top-0.5 translate-x-full -translate-y-full bg-green-active text-white text-xs uppercase py-0.5 px-1 `,
          s_transition.toggleVisiblity(wasJustCopied),
        ]}
      >
        <p>Copied!</p>
      </div>
    </div>
  </CopyToClipboard>
);

const VideoMenuWatchInYoutubeButton = () => {
  const [
    {
      video: { id },
    },
  ] = useVideoSectionContext();

  const url = getYoutubeWatchUrlFromId(id!);

  return <VideoMenuWatchInYoutubeButtonUI url={url} />;
};

const VideoMenuWatchInYoutubeButtonUI = ({ url }: { url: string }) => (
  <a href={url} target="_blank" rel="noreferrer">
    <ContentMenuButton tooltipProps={{ text: "watch in youtube" }}>
      <ArrowSquareOutIcon />
    </ContentMenuButton>
  </a>
);

const VideoCaption = () => {
  const [
    {
      video: { caption },
    },
    { updateCaption },
  ] = useVideoSectionContext();

  return (
    <CaptionUI
      editor={
        <InlineTextEditor
          injectedValue={caption}
          onUpdate={(caption) => updateCaption({ caption })}
          placeholder="optional caption"
        />
      }
    />
  );
};
