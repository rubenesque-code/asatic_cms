import type { NextPage } from "next";
import { ReactElement, useEffect, useState } from "react";
import tw from "twin.macro";
import {
  Gear as GearIcon,
  TagSimple as TagSimpleIcon,
  PlusCircle as PlusCircleIcon,
  Trash as TrashIcon,
  Article as ArticleIcon,
  Image as ImageIcon,
  YoutubeLogo as YoutubeLogoIcon,
  Copy as CopyIcon,
  ArrowSquareOut as ArrowSquareOutIcon,
  WarningCircle,
} from "phosphor-react";
import { useMeasure } from "react-use";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { useDeleteArticleMutation } from "^redux/services/articles";
import { useDispatch, useSelector } from "^redux/hooks";
import { selectById, updatePublishDate } from "^redux/state/articles";
import { selectById as selectAuthorById } from "^redux/state/authors";
import { selectById as selectLanguageById } from "^redux/state/languages";

import {
  ArticleProvider,
  useArticleContext,
} from "^context/articles/ArticleContext";
import {
  ArticleTranslationProvider,
  useArticleTranslationContext,
} from "^context/articles/ArticleTranslationContext";
import {
  ArticleTextSectionProvider,
  useArticleTextSectionContext,
} from "^context/articles/ArticleTextSectionContext";
import {
  ArticleImageSectionProvider,
  useArticleImageSectionContext,
} from "^context/articles/ArticleImageSectionContext";
import {
  ArticleVideoSectionProvider,
  useArticleVideoSectionContext,
} from "^context/articles/ArticleVideoSectionContext";
import {
  SelectLanguageProvider,
  useSelectLanguageContext,
} from "^context/SelectLanguageContext";
import {
  AuthorProvider,
  useAuthorContext,
} from "^context/authors/AuthorContext";

import useGetSubRouteId from "^hooks/useGetSubRouteId";
import useArticlePageTopControls from "^hooks/pages/useArticlePageTopControls";

import { Collection } from "^lib/firebase/firestore/collectionKeys";

import {
  getYoutubeEmbedUrlFromId,
  getYoutubeWatchUrlFromId,
} from "^helpers/youtube";
import {
  mapIds,
  mapLanguageIds,
  orderSortableComponents2,
} from "^helpers/general";

import { ArticleLikeContentTranslationBodySection } from "^types/article-like-primary-content";

import Head from "^components/Head";
import QueryDatabase from "^components/QueryDatabase";
import DatePicker from "^components/date-picker";
import InlineTextEditor from "^components/editors/Inline";
import WithTooltip from "^components/WithTooltip";
import WithWarning from "^components/WithWarning";
import HandleRouteValidity from "^components/primary-content-item-page/HandleRouteValidity";
import WithTags from "^components/WithTags";
import WithProximityPopover from "^components/WithProximityPopover";
import PublishPopoverInitial from "^components/header/PublishPopover";
import WithTranslations from "^components/WithTranslations";
import WithDocAuthors from "^components/WithEditDocAuthors";
import HeaderIconButton from "^components/header/IconButton";
import EmptySectionsUI from "^components/pages/article/EmptySectionsUI";
import AddItemButton from "^components/buttons/AddItem";
import ArticleEditor from "^components/editors/tiptap/ArticleEditor";
import DndSortableContext from "^components/dndkit/DndSortableContext";
import DndSortableElement from "^components/dndkit/DndSortableElement";
import {
  ContentMenuButton,
  ContentMenuContainer,
  ContentMenuVerticalBar,
} from "^components/menus/Content";
import ImageMenuUI from "^components/menus/Image";
import WithAddDocImage from "^components/WithAddDocImage";
import ResizeImage from "^components/resize/Image";
import ImageWrapper from "^components/images/Wrapper";
import WithAddYoutubeVideoInitial from "^components/WithAddYoutubeVideo";
import MeasureWidth from "^components/MeasureWidth";
import DivHover from "^components/DivHover";
import WithDocSubjects from "^components/WithSubjects";
import WithCollections from "^components/WithCollections";
import MissingTranslation from "^components/MissingTranslation";
import HeaderUI from "^components/primary-content-item-page/header/HeaderUI";
import TranslationsPopoverLabelUI from "^components/primary-content-item-page/header/TranslationsPopoverLabelUI";
import SubjectsPopoverButtonUI from "^components/primary-content-item-page/header/SubjectsPopoverButtonUI";
import CollectionsPopoverButtonUI from "^components/primary-content-item-page/header/CollectionsPopoverButtonUI";
import AuthorsPopoverButtonUI from "^components/primary-content-item-page/header/AuthorsPopoverButtonUI";
import SettingsPanelUI from "^components/primary-content-item-page/header/SettingsPanelUI";
import MainCanvas from "^components/primary-content-item-page/MainCanvas";

import s_transition from "^styles/transition";

// todo: nice green #2bbc8a

// todo| COME BACK TO
// todo: need default translation functionality? (none added in this file or redux/state)
// todo: show if anything saved without deployed; if deploy error, success

// todo: Nice to haves:
// todo: visual indication if something to save
// todo: on delete, get redirected with generic "couldn't find article" message. A delete confirm message would be good
// todo: translation for dates
// todo: copy and paste translation
// todo: check youtube video exists by id
// todo: tooltip text appears smaller when more text
// todo: warning symbol above translation popover if invalid translation. useArticleStatus contains the logic.
// todo: warning signs for 'missing' related data e.g. article has translation related to a language that can't be found.
// todo: undo text/toast

const ArticlePage: NextPage = () => {
  return (
    <>
      <Head />
      <QueryDatabase
        collections={[
          Collection.ARTICLES,
          Collection.AUTHORS,
          Collection.COLLECTIONS,
          Collection.IMAGES,
          Collection.LANGUAGES,
          Collection.SUBJECTS,
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

  const { translations } = article;

  const languagesById = mapLanguageIds(translations);

  return (
    <div css={[tw`h-screen overflow-hidden flex flex-col`]}>
      <ArticleProvider article={article}>
        <SelectLanguageProvider languagesById={languagesById}>
          {({ activeLanguageId }) => (
            <ArticleTranslationProvider
              articleId={articleId}
              translation={
                translations.find((t) => t.languageId === activeLanguageId)!
              }
            >
              <>
                <Header />
                <Main />
              </>
            </ArticleTranslationProvider>
          )}
        </SelectLanguageProvider>
      </ArticleProvider>
    </div>
  );
};

const Header = () => {
  const { handleSave, handleUndo, isChange, saveMutationData } =
    useArticlePageTopControls();

  return (
    <HeaderUI
      authorsPopover={<AuthorsPopover />}
      collectionsPopover={<CollectionsPopover />}
      isChange={isChange}
      publishPopover={<PublishPopover />}
      saveFunc={handleSave}
      saveMutationData={saveMutationData}
      settings={<Settings />}
      subjectsPopover={<SubjectsPopover />}
      tagsPopover={<TagsPopover />}
      translationsPopover={<TranslationsPopover />}
      undoFunc={handleUndo}
    />
  );
};

const PublishPopover = () => {
  const [{ publishInfo }, { togglePublishStatus }] = useArticleContext();

  return (
    <PublishPopoverInitial
      isPublished={publishInfo.status === "published"}
      toggleStatus={togglePublishStatus}
    />
  );
};

const TranslationsPopover = () => {
  const [{ translations }, { addTranslation, deleteTranslation }] =
    useArticleContext();
  const [, { setActiveLanguageId }] = useSelectLanguageContext();
  const [{ id: activeTranslationId }] = useArticleTranslationContext();

  const handleDeleteTranslation = (translationToDeleteId: string) => {
    const translationToDeleteIsActive =
      translationToDeleteId === activeTranslationId;

    if (translationToDeleteIsActive) {
      const remainingTranslations = translations.filter(
        (t) => t.id !== translationToDeleteId
      );

      const newActiveLanguageId = remainingTranslations[0].languageId;
      setActiveLanguageId(newActiveLanguageId);
    }

    deleteTranslation({ translationId: translationToDeleteId });
  };

  return (
    <WithTranslations
      activeTranslationId={activeTranslationId}
      docType="recorded event"
      updateActiveTranslation={setActiveLanguageId}
      addToDoc={(languageId) => addTranslation({ languageId })}
      removeFromDoc={handleDeleteTranslation}
      translations={translations}
    >
      <TranslationsPopoverLabel />
    </WithTranslations>
  );
};

const TranslationsPopoverLabel = () => {
  const [activeLanguageId] = useSelectLanguageContext();

  const activeLanguage = useSelector((state) =>
    selectLanguageById(state, activeLanguageId)
  );

  return <TranslationsPopoverLabelUI activeLanguage={activeLanguage} />;
};

const SubjectsPopover = () => {
  const [{ subjectIds, languagesById }, { removeSubject, addSubject }] =
    useArticleContext();

  const [activeLanguageId] = useSelectLanguageContext();

  return (
    <WithDocSubjects
      docActiveLanguageId={activeLanguageId}
      docLanguagesById={languagesById}
      docSubjectsById={subjectIds}
      docType="recorded event"
      onAddSubjectToDoc={(subjectId) => addSubject({ subjectId })}
      onRemoveSubjectFromDoc={(subjectId) => removeSubject({ subjectId })}
    >
      {({ isMissingTranslation }) => (
        <SubjectsPopoverButtonUI isMissingTranslation={isMissingTranslation} />
      )}
    </WithDocSubjects>
  );
};

const CollectionsPopover = () => {
  const [
    { collectionIds, languagesById },
    { addCollection, removeCollection },
  ] = useArticleContext();
  const [activeLanguageId] = useSelectLanguageContext();

  return (
    <WithCollections
      docActiveLanguageId={activeLanguageId}
      docCollectionsById={collectionIds}
      docLanguagesById={languagesById}
      docType="recorded event"
      onAddCollectionToDoc={(collectionId) => addCollection({ collectionId })}
      onRemoveCollectionFromDoc={(collectionId) =>
        removeCollection({ collectionId })
      }
    >
      {({ isMissingTranslation }) => (
        <CollectionsPopoverButtonUI
          isMissingTranslation={isMissingTranslation}
        />
      )}
    </WithCollections>
  );
};

const TagsPopover = () => {
  const [{ tagIds }, { removeTag, addTag }] = useArticleContext();

  return (
    <WithTags
      docTagsById={tagIds}
      docType="article"
      onRemoveFromDoc={(tagId) => removeTag({ tagId })}
      onAddToDoc={(tagId) => addTag({ tagId })}
    >
      <HeaderIconButton tooltipText="tags">
        <TagSimpleIcon />
      </HeaderIconButton>
    </WithTags>
  );
};

const AuthorsPopover = () => {
  const [{ authorIds, languagesById }, { addAuthor, removeAuthor }] =
    useArticleContext();

  const [activeLanguageId] = useSelectLanguageContext();

  return (
    <WithDocAuthors
      docActiveLanguageId={activeLanguageId}
      docAuthorIds={authorIds}
      docLanguageIds={languagesById}
      onAddAuthorToDoc={(authorId) => addAuthor({ authorId })}
      onRemoveAuthorFromDoc={(authorId) => removeAuthor({ authorId })}
    >
      {({ isMissingTranslation }) => (
        <AuthorsPopoverButtonUI isMissingTranslation={isMissingTranslation} />
      )}
    </WithDocAuthors>
  );
};

const Settings = () => {
  return (
    <WithProximityPopover panel={<SettingsPanel />}>
      <HeaderIconButton tooltipText="settings">
        <GearIcon />
      </HeaderIconButton>
    </WithProximityPopover>
  );
};

const SettingsPanel = () => {
  const [deleteArticleFromDb] = useDeleteArticleMutation();
  const [{ id }] = useArticleContext();

  return (
    <SettingsPanelUI
      deleteFunc={() => deleteArticleFromDb({ id, useToasts: true })}
      docType="article"
    />
  );
};

const Main = () => (
  <MainCanvas>
    <ArticleUI />
  </MainCanvas>
);

const ArticleUI = () => (
  <article css={[tw`h-full flex flex-col`]}>
    <header css={[tw`flex flex-col items-start gap-sm pt-lg pb-md border-b`]}>
      <Date />
      <Title />
      <Authors />
    </header>
    <Body />
    <br />
    <br />
    <br />
    <br />
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
    useArticleTranslationContext();

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
  const [{ authorIds }] = useArticleContext();

  return (
    <AuthorsUI
      authors={authorIds.map((id, i) => (
        <AuthorWrapper isAFollowingAuthor={i < authorIds.length - 1} key={id}>
          <HandleAuthorValidity authorId={id} />
        </AuthorWrapper>
      ))}
    />
  );
};

const AuthorsUI = ({ authors }: { authors: ReactElement[] }) => (
  <div css={[tw`flex gap-xs`]}>{authors}</div>
);

const AuthorWrapper = ({
  children,
  isAFollowingAuthor,
}: {
  children: ReactElement;
  isAFollowingAuthor: boolean;
}) => (
  <div css={[tw`flex`]}>
    {children}
    {isAFollowingAuthor ? "," : null}
  </div>
);

const HandleAuthorValidity = ({ authorId }: { authorId: string }) => {
  const author = useSelector((state) => selectAuthorById(state, authorId));

  return author ? (
    <AuthorProvider author={author}>
      <ValidAuthor />
    </AuthorProvider>
  ) : (
    <InvalidAuthorUI />
  );
};

const InvalidAuthorUI = () => (
  <div>
    <WithTooltip
      text={{
        header: "Author error",
        body: "A author was added to this document that can't be found. Try refreshing the page. If the problem persists, contact the site developer.",
      }}
    >
      <span css={[tw`text-red-500 bg-white`]}>
        <WarningCircle />
      </span>
    </WithTooltip>
  </div>
);

const ValidAuthor = () => {
  const [{ translations }] = useAuthorContext();
  const [activeLanguageId] = useSelectLanguageContext();

  const translation = translations.find(
    (t) => t.languageId === activeLanguageId
  );

  return (
    <ValidAuthorUI
      text={translation ? translation.name : <MissingAuthorTranslation />}
    />
  );
};

const ValidAuthorUI = ({ text }: { text: string | ReactElement }) =>
  typeof text === "string" ? (
    <h3 css={[tw`text-xl font-serif-eng`]}>{text}</h3>
  ) : (
    text
  );

const MissingAuthorTranslation = () => (
  <div css={[tw`flex gap-xs`]}>
    <p css={[tw`text-gray-500`]}>...</p>
    <MissingTranslation tooltipText="missing author translation" />
  </div>
);

const Body = () => {
  const [containerRef, { height: articleHeight, width: articleWidth }] =
    useMeasure<HTMLDivElement>();

  const [{ body }] = useArticleTranslationContext();

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

  const [{ body }, { reorderBody }] = useArticleTranslationContext();

  const sectionsOrdered = orderSortableComponents2(body);
  const sectionsOrderedIds = mapIds(sectionsOrdered);

  return (
    <>
      <AddSectionMenu sectionToAddIndex={0} show={sectionHoveredIndex === 0} />
      <DndSortableContext
        elementIds={sectionsOrderedIds}
        onReorder={reorderBody}
      >
        {sectionsOrdered.map((section, i) => (
          <DndSortableElement
            elementId={section.id}
            handlePos="out"
            key={section.id}
          >
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
      <PlusCircleIcon />
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
  const [, { addBodySection }] = useArticleTranslationContext();

  const addImage = () =>
    addBodySection({ index: sectionToAddIndex, type: "image" });
  const addText = () =>
    addBodySection({ index: sectionToAddIndex, type: "text" });
  const addVideo = () =>
    addBodySection({ index: sectionToAddIndex, type: "video" });

  return (
    <WithProximityPopover
      panel={({ close: closePanel }) => (
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
  <ContentMenuContainer show={true}>
    <ContentMenuButton
      onClick={addText}
      tooltipProps={{ text: "text section" }}
    >
      <ArticleIcon />
    </ContentMenuButton>
    <ContentMenuButton
      onClick={addImage}
      tooltipProps={{ text: "image section" }}
    >
      <ImageIcon />
    </ContentMenuButton>
    <ContentMenuButton
      onClick={addVideo}
      tooltipProps={{ text: "video section" }}
    >
      <YoutubeLogoIcon />
    </ContentMenuButton>
  </ContentMenuContainer>
);

const BodySectionSwitch = ({
  section,
}: {
  section: ArticleLikeContentTranslationBodySection;
}) => {
  const { type } = section;
  const [{ id: articleId }] = useArticleContext();
  const [{ id: translationId }] = useArticleTranslationContext();

  const ids = {
    articleId,
    translationId,
  };

  if (type === "text") {
    return (
      <ArticleTextSectionProvider {...ids} section={section}>
        <TextSection />
      </ArticleTextSectionProvider>
    );
  }
  if (type === "image") {
    return (
      <ArticleImageSectionProvider {...ids} section={section}>
        <ImageSection />
      </ArticleImageSectionProvider>
    );
  }
  if (type === "video") {
    return (
      <ArticleVideoSectionProvider {...ids} section={section}>
        <VideoSection />
      </ArticleVideoSectionProvider>
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
  const [, { deleteBodySection }] = useArticleTranslationContext();

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
  <ContentMenuContainer styles={tw`top-0 right-0`} show={show}>
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
  const [{ content }, { updateBodyTextContent }] =
    useArticleTextSectionContext();

  return (
    <TextSectionUI
      editor={
        <ArticleEditor
          initialContent={content || undefined}
          onUpdate={(content) => updateBodyTextContent({ content })}
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
    { updateBodyImageSrc },
  ] = useArticleImageSectionContext();

  return imageId ? (
    <ImageSectionUI />
  ) : (
    <ImageSectionEmptyUI
      addImage={(imageId) => updateBodyImageSrc({ imageId })}
    />
  );
};

const ImageSectionUI = () => (
  <DivHover>
    {(containerIsHovered) => (
      <>
        <div css={[tw`relative`]}>
          <ImageMenu containerIsHovered={containerIsHovered} />
          <ImageSectionImage />
          <ImageCaption />
        </div>
      </>
    )}
  </DivHover>
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
    { updateBodyImageSrc, updateBodyImageVertPosition },
  ] = useArticleImageSectionContext();

  const canFocusLower = vertPosition < 100;
  const canFocusHigher = vertPosition > 0;

  const positionChangeAmount = 10;

  const focusHigher = () => {
    if (!canFocusHigher) {
      return;
    }
    const updatedPosition = vertPosition - positionChangeAmount;
    updateBodyImageVertPosition({ vertPosition: updatedPosition });
  };
  const focusLower = () => {
    if (!canFocusLower) {
      return;
    }
    const updatedPosition = vertPosition + positionChangeAmount;
    updateBodyImageVertPosition({ vertPosition: updatedPosition });
  };

  return (
    <ImageMenuUI
      canFocusHigher={canFocusHigher}
      canFocusLower={canFocusLower}
      focusHigher={focusHigher}
      focusLower={focusLower}
      show={containerIsHovered}
      updateImageSrc={(imageId) => updateBodyImageSrc({ imageId })}
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
    { updateBodyImageAspectRatio },
  ] = useArticleImageSectionContext();

  return (
    <ResizeImage
      aspectRatio={aspectRatio}
      onAspectRatioChange={(aspectRatio) => {
        updateBodyImageAspectRatio({ aspectRatio });
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
    { updateBodyImageCaption },
  ] = useArticleImageSectionContext();

  return (
    <CaptionUI
      editor={
        <InlineTextEditor
          injectedValue={caption}
          onUpdate={(caption) => updateBodyImageCaption({ caption })}
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
  const [{ video }] = useArticleVideoSectionContext();

  return video ? <VideoSectionUI /> : <VideoSectionEmptyUI />;
};

const VideoSectionUI = () => (
  <div>
    <div css={[tw`relative`]}>
      <DivHover>
        {(isHovered) => (
          <>
            <div css={[tw`absolute left-0 top-0 w-full h-full z-10`]}>
              <VideoMenuUI show={isHovered} />
            </div>
            <VideoSectionVideo />
          </>
        )}
      </DivHover>
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
  const [, { updateBodyVideoSrc }] = useArticleVideoSectionContext();

  return (
    <WithAddYoutubeVideoInitial
      onAddVideo={(videoId) => updateBodyVideoSrc({ videoId })}
    >
      {children}
    </WithAddYoutubeVideoInitial>
  );
};

const VideoSectionVideo = () => {
  const [{ video }] = useArticleVideoSectionContext();
  const { id } = video!;

  const url = getYoutubeEmbedUrlFromId(id);

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

  const [{ video }] = useArticleVideoSectionContext();
  const { id } = video!;

  const url = getYoutubeWatchUrlFromId(id);

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
  const [{ video }] = useArticleVideoSectionContext();
  const { id } = video!;

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
  const [{ video }, { updateBodyVideoCaption }] =
    useArticleVideoSectionContext();
  const { caption } = video!;

  return (
    <CaptionUI
      editor={
        <InlineTextEditor
          injectedValue={caption}
          onUpdate={(caption) => updateBodyVideoCaption({ caption })}
          placeholder="optional caption"
        />
      }
    />
  );
};
