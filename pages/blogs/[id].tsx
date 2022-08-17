import type { NextPage } from "next";
import { ReactElement, useEffect, useState } from "react";
import tw from "twin.macro";
import {
  Gear as GearIcon,
  TagSimple as TagSimpleIcon,
  PlusCircle as PlusCircleIcon,
  Trash as TrashIcon,
  Notepad as BlogIcon,
  Image as ImageIcon,
  YoutubeLogo as YoutubeLogoIcon,
  Copy as CopyIcon,
  ArrowSquareOut as ArrowSquareOutIcon,
  WarningCircle,
} from "phosphor-react";
import { useMeasure } from "react-use";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { useDeleteBlogMutation } from "^redux/services/blogs";

import { useDispatch, useSelector } from "^redux/hooks";
import { selectById, updatePublishDate } from "^redux/state/blogs";
import { selectById as selectAuthorById } from "^redux/state/authors";
import { selectById as selectLanguageById } from "^redux/state/languages";

import { BlogProvider, useBlogContext } from "^context/blogs/BlogContext";
import {
  BlogTranslationProvider,
  useBlogTranslationContext,
} from "^context/blogs/BlogTranslationContext";
import {
  BlogTextSectionProvider,
  useBlogTextSectionContext,
} from "^context/blogs/BlogTextSectionContext";
import {
  BlogImageSectionProvider,
  useBlogImageSectionContext,
} from "^context/blogs/BlogImageSectionContext";
import {
  BlogVideoSectionProvider,
  useBlogVideoSectionContext,
} from "^context/blogs/BlogVideoSectionContext";
import {
  SelectLanguageProvider,
  useSelectLanguageContext,
} from "^context/SelectLanguageContext";
import {
  AuthorProvider,
  useAuthorContext,
} from "^context/authors/AuthorContext";

import useGetSubRouteId from "^hooks/useGetSubRouteId";
import useBlogPageTopControls from "^hooks/pages/useBlogPageTopControls";

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
import ContentMenu from "^components/menus/Content";
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

const BlogPage: NextPage = () => {
  return (
    <>
      <Head />
      <QueryDatabase
        collections={[
          Collection.AUTHORS,
          Collection.BLOGS,
          Collection.COLLECTIONS,
          Collection.IMAGES,
          Collection.LANGUAGES,
          Collection.SUBJECTS,
          Collection.TAGS,
        ]}
      >
        <HandleRouteValidity docType="blog">
          <PageContent />
        </HandleRouteValidity>
      </QueryDatabase>
    </>
  );
};

export default BlogPage;

const PageContent = () => {
  const blogId = useGetSubRouteId();
  const blog = useSelector((state) => selectById(state, blogId))!;

  const { translations } = blog;

  const languagesById = mapLanguageIds(translations);

  return (
    <div css={[tw`h-screen overflow-hidden flex flex-col`]}>
      <BlogProvider blog={blog}>
        <SelectLanguageProvider languagesById={languagesById}>
          {({ activeLanguageId }) => (
            <BlogTranslationProvider
              blogId={blogId}
              translation={
                translations.find((t) => t.languageId === activeLanguageId)!
              }
            >
              <>
                <Header />
                <Main />
              </>
            </BlogTranslationProvider>
          )}
        </SelectLanguageProvider>
      </BlogProvider>
    </div>
  );
};

const Header = () => {
  const { handleSave, handleUndo, isChange, saveMutationData } =
    useBlogPageTopControls();

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
  const [{ publishInfo }, { togglePublishStatus }] = useBlogContext();

  return (
    <PublishPopoverInitial
      isPublished={publishInfo.status === "published"}
      toggleStatus={togglePublishStatus}
    />
  );
};

const TranslationsPopover = () => {
  const [{ translations }, { addTranslation, deleteTranslation }] =
    useBlogContext();
  const [, { setActiveLanguageId }] = useSelectLanguageContext();
  const [{ id: activeTranslationId }] = useBlogTranslationContext();

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
    useBlogContext();

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
  ] = useBlogContext();
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
  const [{ tagIds }, { removeTag, addTag }] = useBlogContext();

  return (
    <WithTags
      docTagsById={tagIds}
      docType="blog"
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
    useBlogContext();

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
  const [deleteBlogFromDb] = useDeleteBlogMutation();
  const [{ id }] = useBlogContext();

  return (
    <SettingsPanelUI
      deleteFunc={() => deleteBlogFromDb({ id, useToasts: true })}
      docType="blog"
    />
  );
};

const Main = () => (
  <MainCanvas>
    <BlogUI />
  </MainCanvas>
);

const BlogUI = () => (
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

  const [{ id, publishInfo }] = useBlogContext();
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
    useBlogTranslationContext();

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
  const [{ authorIds }] = useBlogContext();

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

  const [{ body }] = useBlogTranslationContext();

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

  const [{ body }, { reorderBody }] = useBlogTranslationContext();

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
  const [, { addBodySection }] = useBlogTranslationContext();

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
  <ContentMenu show={true}>
    <ContentMenu.Button
      onClick={addText}
      tooltipProps={{ text: "text section" }}
    >
      <BlogIcon />
    </ContentMenu.Button>
    <ContentMenu.Button
      onClick={addImage}
      tooltipProps={{ text: "image section" }}
    >
      <ImageIcon />
    </ContentMenu.Button>
    <ContentMenu.Button
      onClick={addVideo}
      tooltipProps={{ text: "video section" }}
    >
      <YoutubeLogoIcon />
    </ContentMenu.Button>
  </ContentMenu>
);

const BodySectionSwitch = ({
  section,
}: {
  section: ArticleLikeContentTranslationBodySection;
}) => {
  const { type } = section;
  const [{ id: blogId }] = useBlogContext();
  const [{ id: translationId }] = useBlogTranslationContext();

  const ids = {
    blogId,
    translationId,
  };

  if (type === "text") {
    return (
      <BlogTextSectionProvider {...ids} section={section}>
        <TextSection />
      </BlogTextSectionProvider>
    );
  }
  if (type === "image") {
    return (
      <BlogImageSectionProvider {...ids} section={section}>
        <ImageSection />
      </BlogImageSectionProvider>
    );
  }
  if (type === "video") {
    return (
      <BlogVideoSectionProvider {...ids} section={section}>
        <VideoSection />
      </BlogVideoSectionProvider>
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
  const [, { deleteBodySection }] = useBlogTranslationContext();

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
  <ContentMenu styles={tw`top-0 right-0`} show={show}>
    <>
      <WithWarning
        callbackToConfirm={deleteSection}
        warningText="Delete section?"
        type="moderate"
      >
        <ContentMenu.Button
          tooltipProps={{ text: "delete section", type: "action" }}
        >
          <TrashIcon />
        </ContentMenu.Button>
      </WithWarning>
    </>
  </ContentMenu>
);

const TextSection = () => {
  const [{ content }, { updateBodyTextContent }] = useBlogTextSectionContext();

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
  ] = useBlogImageSectionContext();

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
  ] = useBlogImageSectionContext();

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
  ] = useBlogImageSectionContext();

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
  ] = useBlogImageSectionContext();

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
  const [{ video }] = useBlogVideoSectionContext();

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
  const [, { updateBodyVideoSrc }] = useBlogVideoSectionContext();

  return (
    <WithAddYoutubeVideoInitial
      onAddVideo={(videoId) => updateBodyVideoSrc({ videoId })}
    >
      {children}
    </WithAddYoutubeVideoInitial>
  );
};

const VideoSectionVideo = () => {
  const [{ video }] = useBlogVideoSectionContext();
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
  <ContentMenu show={show}>
    <WithAddYoutubeVideo>
      <ContentMenu.Button tooltipProps={{ text: "change video" }}>
        <YoutubeLogoIcon />
      </ContentMenu.Button>
    </WithAddYoutubeVideo>
    <ContentMenu.VerticalBar />
    <VideoMenuCopyButton />
    <VideoMenuWatchInYoutubeButton />
  </ContentMenu>
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

  const [{ video }] = useBlogVideoSectionContext();
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
      <ContentMenu.Button tooltipProps={{ text: "copy youtube url" }}>
        <CopyIcon />
      </ContentMenu.Button>
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
  const [{ video }] = useBlogVideoSectionContext();
  const { id } = video!;

  const url = getYoutubeWatchUrlFromId(id!);

  return <VideoMenuWatchInYoutubeButtonUI url={url} />;
};

const VideoMenuWatchInYoutubeButtonUI = ({ url }: { url: string }) => (
  <a href={url} target="_blank" rel="noreferrer">
    <ContentMenu.Button tooltipProps={{ text: "watch in youtube" }}>
      <ArrowSquareOutIcon />
    </ContentMenu.Button>
  </a>
);

const VideoCaption = () => {
  const [{ video }, { updateBodyVideoCaption }] = useBlogVideoSectionContext();
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
