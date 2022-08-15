import { NextPage } from "next";
import React, { ReactElement, useState } from "react";
import {
  ArrowRight,
  ArrowsInLineHorizontal,
  ArrowsOutLineHorizontal,
  Image as ImageIcon,
  Plus as PlusIcon,
  PlusCircle,
  Trash,
  WarningCircle,
} from "phosphor-react";
import tw from "twin.macro";
import { JSONContent } from "@tiptap/react";

import { useDispatch, useSelector } from "^redux/hooks";
import {
  selectTotal as selectTotalLandingSections,
  selectById as selectLandingSectionById,
  selectIds as selectLandingSectionsIds,
  addComponentToCustom,
} from "^redux/state/landing";
import {
  selectAll as selectArticles,
  updateSummary as updateSummaryAction,
  selectById as selectArticleById,
} from "^redux/state/articles";

import { Collection } from "^lib/firebase/firestore/collectionKeys";

import useHovered from "^hooks/useHovered";

import {
  formatDateDMYStr,
  mapIds,
  orderSortableComponents,
} from "^helpers/general";
import {
  computeTranslationForActiveLanguage as selectTranslationForSiteLanguage,
  getArticleSummaryFromBody,
  getArticleSummaryFromTranslation,
  getArticleSummaryImageId,
  getFirstImageFromArticleBody,
} from "^helpers/article";

import {
  LandingSectionProvider,
  useLandingSectionContext,
} from "^context/landing/LandingSectionContext";
import {
  LandingCustomSectionProvider,
  useLandingCustomSectionContext,
} from "^context/landing/LandingCustomSectionContext";
import {
  SiteLanguageProvider,
  useSiteLanguageContext,
} from "^context/SiteLanguageContext";
import {
  ArticleProvider,
  useArticleContext,
} from "^context/articles/ArticleContext";
import {
  ArticleTranslationProvider,
  useArticleTranslationContext,
} from "^context/articles/ArticleTranslationContext";
import { BlogProvider, useBlogContext } from "^context/blogs/BlogContext";
import {
  BlogTranslationProvider,
  useBlogTranslationContext,
} from "^context/blogs/BlogTranslationContext";

import {
  LandingSectionAuto,
  LandingSectionCustom,
  LandingSectionCustomComponent,
} from "^types/landing";

import Head from "^components/Head";
import QueryDatabase from "^components/QueryDatabase";
import WithTooltip from "^components/WithTooltip";
import MissingText from "^components/MissingText";
import SimpleTipTapEditor from "^components/editors/tiptap/SimpleEditor";
import WithWarning from "^components/WithWarning";
import DndSortableContext from "^components/dndkit/DndSortableContext";
import DndSortableElement from "^components/dndkit/DndSortableElement";
import ImageWrapper from "^components/images/Wrapper";
import ResizeImage from "^components/resize/Image";
import WithAddDocImage from "^components/WithAddDocImage";
import UserCreatedIcon from "^components/icons/UserCreated";
import SiteLanguagePopover from "^components/header/SiteLanguage";
import Header from "^components/pages/landing/Header";
import WithAddLandingSectionPopover from "^components/landing/WithAddSectionPopover";
import NoLandingSectionsUI from "^components/landing/NoLandingSectionsUI";
import WithAddCustomSectionComponentInitial from "^components/pages/landing/WithAddCustomSectionComponent";
import {
  ContentMenuButton,
  ContentMenuContainer,
  ContentMenuVerticalBar,
} from "^components/menus/Content";
import ImageMenuUI from "^components/menus/Image";

import DocAuthorsText from "^components/authors/DocAuthorsText";
import AutoSectionArticleLikeTitleUI from "^components/landing/auto-section/article-like/TitleUI";
import AutoSectionArticleLikePublishDateUI from "^components/landing/auto-section/article-like/PublishDateUI";
import AutoSectionArticleSummaryUI from "^components/landing/auto-section/article-like/SummaryUI";
import AutoSectionArticleLikeUI from "^components/landing/auto-section/article-like/ArticleLikeUI";
import AutoSectionArticleLikeAuthorsStylingUI from "^components/landing/auto-section/article-like/AuthorsStylingUI";
import { selectAll as selectBlogs } from "^redux/state/blogs";
import MainContainerUI from "^components/landing/auto-section/article-like/MainContainerUI";
import ContainerHover from "^components/ContainerHover";
import AutoSectionUI from "^components/landing/auto-section/SectionUI";
import AutoSectionSwiperUI from "^components/landing/auto-section/SwiperUI";
import MoveSectionDownButtonUI from "^components/landing/buttons/MoveSectionDownButtonUI";
import MoveSectionUpButtonUI from "^components/landing/buttons/MoveSectionUpButtonUI";
import DeleteSectionButtonUI from "^components/landing/buttons/DeleteSectionButtonUI";
import EditImagePopover from "^components/landing/EditImagePopover";
import AddSectionMenuUI from "^components/landing/AddSectionMenuUI";
import { HoverHandlers } from "^types/props";

// todo: add content uses full tables of content

// todo: recorded-event type  + can think of any others? Have 'videos' and a new 'subjects' category that all content types can be added to.
// todo: index pages for articles and above new types
// todo: content search list of content; not ideal having just a search.
// todo: filter/indicate for draft state. same for content type with error. same for content type invalid (no valid translation)
// todo: link to go to edit content page for each component
// todo: should be able to edit all that can be seen? e.g. authors, title.

// todo: add a subjects + collections page

// todo: info somewhere about order of showing translations
// todo: choose font-serif. Also affects article font sizing
// todo: handle component borders
// todo: article validation + article publish status
// todo: handling authors properly? e.g. missing author translation

// todo: extend tiptap content type for image

// todo: image node type written twice on an article

// todo: asserting context value as {} leads to useContext check to not work

// todo: selectEntitiesByIds assertion in each state type is probably not safe and not good practice

// todo: NICE TO HAVES
// todo: select from article images on article image button
// todo: order auto-section components to show those not in custom sections.
// todo: make clear what each menu is controlling. e.g. on image menu hover, highlight image

const Landing: NextPage = () => {
  return (
    <>
      <Head />
      <QueryDatabase
        collections={[
          Collection.LANDING,
          Collection.ARTICLES,
          Collection.AUTHORS,
          Collection.IMAGES,
          Collection.LANGUAGES,
          Collection.SUBJECTS,
          Collection.COLLECTIONS,
        ]}
      >
        <PageContent />
      </QueryDatabase>
    </>
  );
};

export default Landing;

const PageContent = () => {
  return (
    <div css={[tw`h-screen max-h-screen overflow-y-hidden flex flex-col`]}>
      <SiteLanguageProvider>
        <>
          <Header siteLanguage={<SiteLanguage />} />
          <Main />
        </>
      </SiteLanguageProvider>
    </div>
  );
};

const SiteLanguage = () => {
  const {
    siteLanguageId: activeLanguageId,
    setSiteLanguageId: setActiveLanguageId,
  } = useSiteLanguageContext();

  return (
    <SiteLanguagePopover
      languageId={activeLanguageId}
      onUpdateLanguage={setActiveLanguageId}
    />
  );
};

const Main = () => {
  const numSections = useSelector(selectTotalLandingSections);

  return (
    <MainContainerUI>
      {numSections ? <Sections /> : <NoLandingSectionsUI />}
    </MainContainerUI>
  );
};

const Sections = () => {
  const [sectionHoveredIndex, setSectionHoveredIndex] = useState<number | null>(
    null
  );

  const sectionIds = useSelector(selectLandingSectionsIds) as string[];

  return (
    <>
      <AddSectionMenu
        sectionToAddIndex={0}
        adjacentSectionHovered={sectionHoveredIndex === 0}
      />
      {sectionIds.map((id, i) => (
        <React.Fragment key={id}>
          <SectionContainerUI
            onMouseEnter={() => setSectionHoveredIndex(i)}
            onMouseLeave={() => setSectionHoveredIndex(null)}
            key={id}
          >
            <SectionTypeSwitch
              id={id}
              sectionIsHovered={sectionHoveredIndex === i}
            />
          </SectionContainerUI>
          <AddSectionMenu
            sectionToAddIndex={i + 1}
            adjacentSectionHovered={
              sectionHoveredIndex === i || sectionHoveredIndex === i + 1
            }
          />
        </React.Fragment>
      ))}
    </>
  );
};

const AddSectionMenu = ({
  sectionToAddIndex,
  adjacentSectionHovered,
}: {
  sectionToAddIndex: number;
  adjacentSectionHovered: boolean;
}) => {
  const [containerIsHovered, hoverHandlers] = useHovered();

  const show = adjacentSectionHovered || containerIsHovered;

  return (
    <AddSectionMenuUI
      show={show}
      addSectionButton={
        <AddSectionButton newSectionIndex={sectionToAddIndex} />
      }
      {...hoverHandlers}
    />
  );
};

const AddSectionButton = ({ newSectionIndex }: { newSectionIndex: number }) => (
  <WithAddLandingSectionPopover newSectionIndex={newSectionIndex}>
    <WithTooltip text="add section here" type="action">
      <button
        css={[
          tw`rounded-full bg-transparent hover:bg-white text-gray-400 hover:scale-125 transition-all ease-in duration-75 hover:text-green-active`,
        ]}
        type="button"
      >
        <PlusCircle />
      </button>
    </WithTooltip>
  </WithAddLandingSectionPopover>
);

const SectionContainerUI = ({
  children,
  ...hoverHandlers
}: { children: ReactElement } & HoverHandlers) => (
  <div css={[tw`relative`]} {...hoverHandlers}>
    {children}
  </div>
);

const SectionTypeSwitch = ({
  id,
  sectionIsHovered,
}: {
  id: string;
  sectionIsHovered: boolean;
}) => {
  const section = useSelector((state) => selectLandingSectionById(state, id))!;

  return section.type === "auto" ? (
    <LandingSectionProvider section={section}>
      <AutoSection sectionIsHovered={sectionIsHovered} />
    </LandingSectionProvider>
  ) : (
    <LandingSectionProvider section={section}>
      <LandingCustomSectionProvider section={section}>
        <div>CUSTOM SECTION</div>
        {/* <CustomSection /> */}
      </LandingCustomSectionProvider>
    </LandingSectionProvider>
  );
};

const AutoSection = ({ sectionIsHovered }: { sectionIsHovered: boolean }) => {
  return (
    <>
      <AutoSectionContentTypeSwitch />
      <SectionMenu show={sectionIsHovered} />
    </>
  );
};

const SectionMenu = ({
  extraButtons,
  show,
}: {
  show: boolean;
  extraButtons?: ReactElement | null;
}) => (
  <ContentMenuContainer
    show={show}
    styles={tw`right-0 top-xs -translate-y-full`}
  >
    <>
      {extraButtons ? extraButtons : null}
      <MoveSectionDownButton />
      <MoveSectionUpButton />
      <ContentMenuVerticalBar />
      <DeleteSectionButton />
    </>
  </ContentMenuContainer>
);

const MoveSectionDownButton = () => {
  const numSections = useSelector(selectTotalLandingSections);
  const [{ index }, { moveSection }] = useLandingSectionContext();

  const canMoveDown = index < numSections - 1;

  return (
    <MoveSectionDownButtonUI
      isDisabled={!canMoveDown}
      onClick={() => moveSection({ direction: "down" })}
    />
  );
};

const MoveSectionUpButton = () => {
  const [{ index }, { moveSection }] = useLandingSectionContext();

  const canMoveUp = index > 0;

  return (
    <MoveSectionUpButtonUI
      isDisabled={!canMoveUp}
      onClick={() => moveSection({ direction: "up" })}
    />
  );
};

const DeleteSectionButton = () => {
  const [, { removeOne }] = useLandingSectionContext();

  return <DeleteSectionButtonUI onClick={removeOne} />;
};

const AutoSectionContentTypeSwitch = () => {
  const [section] = useLandingSectionContext();
  const { contentType } = section as LandingSectionAuto;

  return contentType === "article" ? (
    <ArticlesAutoSection />
  ) : contentType === "blog" ? (
    <AutoSectionUI
      colorTheme="blue"
      swiper={<BlogsSwiper />}
      title="Blogs"
      moreFromText="More from the blog"
    />
  ) : null;
};

const ArticlesAutoSection = () => (
  <AutoSectionUI
    colorTheme="cream"
    swiper={<ArticlesSwiper />}
    title="Articles"
    moreFromText="More from articles"
  />
);

const ArticlesSwiper = () => {
  const articles = useSelector(selectArticles);
  // reorder articles

  return (
    <AutoSectionSwiperUI
      colorTheme="cream"
      elements={articles.map((article) => (
        <ArticleProvider article={article} key={article.id}>
          <AutoSectionArticle />
        </ArticleProvider>
      ))}
    />
  );
};

// todo: handle: incomplete, draft.
const AutoSectionArticle = () => {
  const [
    {
      id: articleId,
      translations,
      landing: { useImage, imageId },
    },
  ] = useArticleContext();
  const { siteLanguageId } = useSiteLanguageContext();

  const translation = selectTranslationForSiteLanguage(
    translations,
    siteLanguageId
  );

  return (
    <ArticleTranslationProvider translation={translation} articleId={articleId}>
      <ContainerHover styles={tw`border-r h-full`}>
        {(isHovered) => (
          <>
            <AutoSectionArticleLikeUI
              image={useImage && imageId ? <AutoSectionArticleImage /> : null}
              title={<AutoSectionArticleTitle />}
              authors={<AutoSectionArticleAuthors />}
              short={<AutoSectionArticleSummary />}
            />
            <AutoSectionArticleMenu containerIsHovered={isHovered} />
          </>
        )}
      </ContainerHover>
    </ArticleTranslationProvider>
  );
};

const AutoSectionArticleMenu = ({
  containerIsHovered,
}: {
  containerIsHovered: boolean;
}) => {
  const [
    {
      landing: { useImage, imageId },
    },
    { toggleUseLandingImage, updateLandingImageSrc },
  ] = useArticleContext();

  const onSelectImage = (imageId: string) => {
    if (!useImage) {
      toggleUseLandingImage();
    }
    updateLandingImageSrc({ imageId });
  };

  const show = (!useImage || !imageId) && containerIsHovered;

  return (
    <ContentMenuContainer show={show} styles={tw`top-0 right-0`}>
      <EditImagePopover onSelectImage={onSelectImage} tooltipText="add image" />
    </ContentMenuContainer>
  );
};

const AutoSectionArticleImage = () => {
  const [
    {
      landing: {
        imageId: summaryImageId,
        autoSection: { imgVertPosition },
      },
    },
  ] = useArticleContext();

  const [{ body }] = useArticleTranslationContext();

  const imageIdFromBody = getFirstImageFromArticleBody(body);

  const imageId = summaryImageId
    ? summaryImageId
    : imageIdFromBody
    ? imageIdFromBody
    : null;

  return imageId ? (
    <ContainerHover styles={tw`w-full h-full`}>
      {(isHovered) => (
        <>
          <ImageWrapper
            imgId={imageId}
            objectFit="cover"
            vertPosition={imgVertPosition}
          />
          <AutoSectionArticleImageMenu show={isHovered} />
        </>
      )}
    </ContainerHover>
  ) : null;
};

const AutoSectionArticleImageMenu = ({ show }: { show: boolean }) => {
  const [
    {
      landing: {
        autoSection: { imgVertPosition },
      },
    },
    {
      toggleUseLandingImage,
      updateLandingAutoSectionImageVertPosition,
      updateLandingImageSrc,
    },
  ] = useArticleContext();

  const canFocusHigher = imgVertPosition > 0;
  const canFocusLower = imgVertPosition < 100;

  const positionChangeAmount = 10;

  const focusHigher = () => {
    if (!canFocusHigher) {
      return;
    }
    const updatedPosition = imgVertPosition - positionChangeAmount;
    updateLandingAutoSectionImageVertPosition({
      imgVertPosition: updatedPosition,
    });
  };
  const focusLower = () => {
    if (!canFocusLower) {
      return;
    }
    const updatedPosition = imgVertPosition + positionChangeAmount;
    updateLandingAutoSectionImageVertPosition({
      imgVertPosition: updatedPosition,
    });
  };

  return (
    <ImageMenuUI
      canFocusHigher={canFocusHigher}
      canFocusLower={canFocusLower}
      focusHigher={focusHigher}
      focusLower={focusLower}
      show={show}
      updateImageSrc={(imageId) => updateLandingImageSrc({ imageId })}
      additionalButtons={
        <>
          <ContentMenuVerticalBar />
          <ImageMenuRemoveButton removeImage={toggleUseLandingImage} />
        </>
      }
    />
  );
};

const AutoSectionArticleAuthors = () => {
  const [{ authorIds }] = useArticleContext();
  const [{ languageId }] = useArticleTranslationContext();

  if (!authorIds.length) {
    return null;
  }

  return (
    <AutoSectionArticleLikeAuthorsStylingUI>
      <DocAuthorsText authorIds={authorIds} docActiveLanguageId={languageId} />
    </AutoSectionArticleLikeAuthorsStylingUI>
  );
};

const AutoSectionArticlePublishDate = () => {
  const [
    {
      publishInfo: { date },
    },
  ] = useArticleContext();
  const dateStr = date ? formatDateDMYStr(date) : null;

  return <AutoSectionArticleLikePublishDateUI date={dateStr} />;
};

const AutoSectionArticleTitle = () => {
  const [{ title }] = useArticleTranslationContext();

  return <AutoSectionArticleLikeTitleUI colorTheme="cream" title={title} />;
};

const AutoSectionArticleSummary = () => {
  const [
    {
      landing: { useImage, imageId },
    },
  ] = useArticleContext();

  const isImage = useImage && imageId;

  const [translation, { updateSummary }] = useArticleTranslationContext();

  const {
    body,
    landingPage: { autoSummary },
  } = translation;

  const bodyText = getArticleSummaryFromBody(body);

  const editorInitialContent = autoSummary || bodyText || undefined;
  const isInitialContent = Boolean(editorInitialContent);

  const onUpdate = (text: JSONContent) =>
    updateSummary({
      summary: text,
      summaryType: "auto",
    });

  return (
    <AutoSectionArticleSummaryUI
      editor={
        <SimpleTipTapEditor
          initialContent={editorInitialContent}
          onUpdate={onUpdate}
          placeholder="summary here..."
          lineClamp={!isImage ? "line-clamp-8" : "line-clamp-4"}
          key={translation.id}
        />
      }
      isContent={Boolean(isInitialContent)}
    />
  );
};

const BlogsSwiper = () => {
  const blogs = useSelector(selectBlogs);

  return (
    <AutoSectionSwiperUI
      colorTheme="blue"
      elements={blogs.map((blog) => (
        <BlogProvider blog={blog} key={blog.id}>
          <AutoSectionBlog />
        </BlogProvider>
      ))}
    />
  );
};

// todo: handle: incomplete, draft.
const AutoSectionBlog = () => {
  const [{ id: blogId, translations }] = useBlogContext();
  const { siteLanguageId } = useSiteLanguageContext();

  const translation = selectTranslationForSiteLanguage(
    translations,
    siteLanguageId
  );

  return (
    <BlogTranslationProvider translation={translation} blogId={blogId}>
      <AutoSectionArticleLikeUI
        publishDate={<AutoSectionBlogPublishDate />}
        title={<AutoSectionBlogTitle />}
        authors={<AutoSectionBlogAuthors />}
        short={<AutoSectionBlogSummary />}
      />
    </BlogTranslationProvider>
  );
};

const AutoSectionBlogAuthors = () => {
  const [{ authorIds }] = useBlogContext();
  const [{ languageId }] = useBlogTranslationContext();

  if (!authorIds.length) {
    return null;
  }

  return (
    <AutoSectionArticleLikeAuthorsStylingUI>
      <DocAuthorsText authorIds={authorIds} docActiveLanguageId={languageId} />
    </AutoSectionArticleLikeAuthorsStylingUI>
  );
};

const AutoSectionBlogPublishDate = () => {
  const [
    {
      publishInfo: { date },
    },
  ] = useBlogContext();
  const dateStr = date ? formatDateDMYStr(date) : null;

  return <AutoSectionArticleLikePublishDateUI date={dateStr} />;
};

const AutoSectionBlogTitle = () => {
  const [{ title }] = useBlogTranslationContext();

  return <AutoSectionArticleLikeTitleUI title={title} />;
};

const AutoSectionBlogSummary = () => {
  const [translation, { updateSummary }] = useBlogTranslationContext();

  const summary = getArticleSummaryFromTranslation({
    summaryType: "auto",
    translation,
  });
  const editorInitialContent = summary || undefined;
  const isInitialContent = Boolean(editorInitialContent);

  const onUpdate = (text: JSONContent) =>
    updateSummary({
      summary: text,
      summaryType: "auto",
    });

  return (
    <AutoSectionArticleSummaryUI
      editor={
        <SimpleTipTapEditor
          initialContent={editorInitialContent}
          onUpdate={onUpdate}
          placeholder="summary here..."
          lineClamp="line-clamp-4"
          key={translation.id}
        />
      }
      isContent={Boolean(isInitialContent)}
    />
  );
};

// ADD CUSTOM SECTION MENU

const WithAddCustomSectionComponent = ({
  children,
}: {
  children: ReactElement;
}) => {
  const [{ id: sectionId }] = useLandingCustomSectionContext();

  const dispatch = useDispatch();
  const addComponent = ({
    docId,
    type,
  }: {
    docId: string;
    type: LandingSectionCustom["components"][number]["type"];
  }) => dispatch(addComponentToCustom({ docId, id: sectionId, type }));

  return (
    <WithAddCustomSectionComponentInitial addComponent={addComponent}>
      {children}
    </WithAddCustomSectionComponentInitial>
  );
};

const CustomSectionMenuExtraButtonsUI = () => (
  <>
    <WithAddCustomSectionComponent>
      <ContentMenuButton tooltipProps={{ text: "add content" }}>
        <PlusIcon />
      </ContentMenuButton>
    </WithAddCustomSectionComponent>
    <ContentMenuVerticalBar />
  </>
);

// CUSTOM SECTION

const CustomSection = ({
  section,
  isHovered: containerIsHovered,
}: {
  section: LandingSectionCustom;
  isHovered: boolean;
}) => {
  const isContent = section.components.length;

  const numSections = useSelector(selectTotalLandingSections);

  const canMoveDown = section.index < numSections;
  const canMoveUp = section.index > 1;
  const sectionId = section.id;

  return (
    <LandingCustomSectionProvider section={section}>
      <HoverProvider>
        <CustomSectionUI
          content={
            isContent ? <CustomSectionComponents /> : <EmptyCustomSectionUI />
          }
          menu={
            <SectionMenu
              canMoveDown={canMoveDown}
              canMoveUp={canMoveUp}
              extraButtons={<CustomSectionMenuExtraButtonsUI />}
              sectionId={sectionId}
              show={containerIsHovered}
            />
          }
        />
      </HoverProvider>
    </LandingCustomSectionProvider>
  );
};

const CustomSectionUI = ({
  content,
  menu,
}: {
  content: ReactElement;
  menu: ReactElement;
}) => (
  <div css={[tw`relative`]}>
    {content}
    {menu}
  </div>
);

const EmptyCustomSectionUI = () => {
  return (
    <div css={[tw`text-center py-lg border-2 border-dashed`]}>
      <div css={[tw`inline-block`]}>
        <p css={[tw`font-medium flex items-center gap-sm`]}>
          <span>
            <UserCreatedIcon />
          </span>
          <span>Custom section</span>
        </p>
        <p css={[tw`mt-xxs text-gray-600 text-sm`]}>No content yet</p>
      </div>
      <div css={[tw`mt-md`]}>
        <WithAddCustomSectionComponent>
          <button
            css={[
              tw`flex items-center gap-xs text-sm text-gray-700 font-medium border border-gray-400 py-0.5 px-3 rounded-sm`,
            ]}
            type="button"
          >
            <span>Add Content</span>
            <span>
              <ArrowRight />
            </span>
          </button>
        </WithAddCustomSectionComponent>
      </div>
    </div>
  );
};

const CustomSectionComponents = () => {
  const [{ components }, { reorderComponents }] =
    useLandingCustomSectionContext();

  const componentsOrdered = orderSortableComponents(components);
  const componentsOrderedById = mapIds(componentsOrdered);

  return (
    <CustomSectionComponentsUI>
      <DndSortableContext
        elementIds={componentsOrderedById}
        onReorder={reorderComponents}
      >
        {componentsOrdered.map((component) => (
          <CustomSectionComponentProviders
            component={component}
            key={component.id}
          >
            <CustomSectionComponentSortable>
              <CustomSectionComponentTypeSwitch />
            </CustomSectionComponentSortable>
          </CustomSectionComponentProviders>
        ))}
      </DndSortableContext>
    </CustomSectionComponentsUI>
  );
};

const CustomSectionComponentsUI = ({
  children,
}: {
  children: ReactElement;
}) => (
  <div css={[tw`flex flex-col items-center border-t border-b`]}>
    <div css={[tw`grid grid-cols-4 max-w-[95%]`]}>{children}</div>
  </div>
);

const CustomSectionComponentProviders = ({
  children,
  component,
}: {
  children: ReactElement;
  component: LandingSectionCustomComponent;
}) => {
  const [{ id: sectionId }] = useLandingCustomSectionContext();

  return (
    <LandingCustomSectionComponentProvider
      component={component}
      sectionId={sectionId}
    >
      <HoverProvider>{children}</HoverProvider>
    </LandingCustomSectionComponentProvider>
  );
};

const CustomSectionComponentSortable = ({
  children,
}: {
  children: ReactElement;
}) => {
  const [{ id, width }] = useLandingCustomSectionComponentContext();

  return (
    <DndSortableElement colSpan={width} elementId={id}>
      {children}
    </DndSortableElement>
  );
};

const CustomSectionComponentTypeSwitch = () => {
  const [{ type }] = useLandingCustomSectionComponentContext();

  if (type === "article") {
    return <CustomSectionArticleContainer />;
  }

  throw new Error("Invalid component type");
};

const CustomSectionComponentContainer = ({
  children,
  menu,
}: {
  children: ReactElement;
  menu: ReactElement;
}) => {
  const [, hoverHandlers] = useHoverContext();

  return (
    <CustomSectionComponentContainerUI menu={menu} {...hoverHandlers}>
      {children}
    </CustomSectionComponentContainerUI>
  );
};

const CustomSectionComponentContainerUI = ({
  children,
  menu,
  ...hoverHandlers
}: {
  children: ReactElement;
  menu: ReactElement;
} & HoverHandlers) => (
  <div css={[tw`relative h-full min-h-[400px]`]} {...hoverHandlers}>
    {children}
    {menu}
  </div>
);

const CustomSectionComponentMenu = ({
  addImage,
}: {
  addImage?: ReactElement;
}) => {
  const [containerIsHovered] = useHoverContext();

  const [{ width }, { updateWidth, deleteComponent }] =
    useLandingCustomSectionComponentContext();

  const canNarrow = width > 1;
  const canWiden = width < 3;

  const narrow = () => canNarrow && updateWidth({ width: width - 1 });
  const widen = () => canWiden && updateWidth({ width: width + 1 });

  return (
    <CustomSectionComponentMenuUI
      show={containerIsHovered}
      addImage={addImage}
      canNarrow={canNarrow}
      canWiden={canWiden}
      narrow={narrow}
      widen={widen}
      deleteComponent={deleteComponent}
    />
  );
};

const CustomSectionComponentMenuUI = ({
  canWiden,
  widen,
  canNarrow,
  narrow,
  addImage,
  show,
  deleteComponent,
}: {
  show: boolean;
  addImage?: ReactElement;
  widen: () => void;
  canWiden: boolean;
  narrow: () => void;
  canNarrow: boolean;
  deleteComponent: () => void;
}) => (
  <div
    css={[
      s_menu.container,
      tw`opacity-50 hover:opacity-100 text-gray-400 hover:text-black transition-opacity ease-in-out duration-75`,
      !show && tw`opacity-0`,
    ]}
  >
    {addImage ? addImage : null}
    <WithTooltip text="widen">
      <button
        css={[s_menu.button({ isDisabled: !canWiden })]}
        onClick={widen}
        type="button"
      >
        <ArrowsOutLineHorizontal />
      </button>
    </WithTooltip>
    <WithTooltip text="narrow">
      <button
        css={[s_menu.button({ isDisabled: !canNarrow })]}
        onClick={narrow}
        type="button"
      >
        <ArrowsInLineHorizontal />
      </button>
    </WithTooltip>
    <div css={[s_menu.verticalBar]} />
    <WithWarning
      callbackToConfirm={deleteComponent}
      warningText="Delete component?"
      type="moderate"
    >
      <WithTooltip text="delete component" type="action">
        <button css={[s_menu.button()]} type="button">
          <Trash />
        </button>
      </WithTooltip>
    </WithWarning>
  </div>
);

const AddCustomSectionImageMenuButton = () => {
  const [article, { updateSummaryImageSrc, toggleUseSummaryImage }] =
    useArticleContext();
  const {
    summaryImage: { useImage },
  } = article;
  const [translation] = useArticleTranslationContext();

  const summaryImageId = getArticleSummaryImageId(article, translation);

  const addImage = (imgId: string) => {
    updateSummaryImageSrc({ imgId });
    if (!useImage) {
      toggleUseSummaryImage();
    }
  };

  if (!summaryImageId || !useImage) {
    return <AddCustomSectionImageMenuButtonUI addImage={addImage} />;
  }

  return null;
};

const AddCustomSectionImageMenuButtonUI = ({
  addImage,
}: {
  addImage: (id: string) => void;
}) => (
  <>
    <WithAddDocImage onAddImage={addImage}>
      <WithTooltip text="add image">
        <button css={[s_menu.button()]} type="button">
          <ImageIcon />
        </button>
      </WithTooltip>
    </WithAddDocImage>
    <div css={[s_menu.verticalBar]} />
  </>
);

const CustomSectionArticleContainer = () => {
  const [{ docId }] = useLandingCustomSectionComponentContext();
  const article = useSelector((state) => selectArticleById(state, docId));

  const { siteLanguageId } = useSiteLanguageContext();

  const translation = article
    ? selectTranslationForSiteLanguage(article.translations, siteLanguageId)
    : null;

  return article ? (
    <ArticleProvider article={article}>
      <ArticleTranslationProvider
        articleId={article.id}
        translation={translation!}
      >
        <CustomSectionComponentContainer
          menu={
            <CustomSectionComponentMenu
              addImage={<AddCustomSectionImageMenuButton />}
            />
          }
        >
          <CustomSectionArticle />
        </CustomSectionComponentContainer>
      </ArticleTranslationProvider>
    </ArticleProvider>
  ) : (
    <CustomSectionComponentContainer menu={<CustomSectionComponentMenu />}>
      <CustomSectionArticleMissingUI />
    </CustomSectionComponentContainer>
  );
};

const CustomSectionArticleMissingUI = () => (
  <div
    css={[
      tw`relative p-md border-2 border-red-warning h-full grid place-items-center`,
    ]}
  >
    <div css={[tw`text-center`]}>
      <h4 css={[tw`font-medium flex items-center justify-center gap-xs`]}>
        <span css={[tw`text-red-warning`]}>
          <WarningCircle weight="bold" />
        </span>
        Missing article
      </h4>
      <p css={[tw`mt-sm text-sm text-gray-700`]}>
        This component references an article that couldn&apos;t be found. <br />{" "}
        It has probably been deleted by a user, but you can try refreshing the
        page.
      </p>
    </div>
  </div>
);

const CustomSectionArticle = () => {
  const [{ title }] = useArticleTranslationContext();

  return (
    <CustomSectionArticleUI
      image={<CustomSectionArticleHandleImage />}
      title={<CustomSectionArticleTitleUI title={title} />}
      summaryText={<CustomSectionArticleSummary />}
    />
  );
};

const CustomSectionArticleUI = ({
  image,
  title,
  summaryText,
}: {
  image: ReactElement | null;
  title: ReactElement;
  summaryText: ReactElement;
}) => (
  <div css={[tw`pb-lg border-l border-r`]}>
    {image ? <div css={[tw`px-xs pt-xs`]}>{image}</div> : null}
    <div css={[tw`px-sm mt-md font-serif-eng`]}>
      <div>{title}</div>
      <div css={[tw`mt-md`]}>{summaryText}</div>
    </div>
  </div>
);

const CustomSectionArticleHandleImage = () => {
  const [article] = useArticleContext();
  const {
    summaryImage: { useImage },
  } = article;
  const [translation] = useArticleTranslationContext();

  const summaryImageId = getArticleSummaryImageId(article, translation);

  if (useImage && summaryImageId) {
    return (
      <HoverProvider>
        <CustomSectionArticleImage imgId={summaryImageId} />
      </HoverProvider>
    );
  }

  return null;
};

const CustomSectionArticleImage = ({ imgId }: { imgId: string }) => {
  const [, hoverHandlers] = useHoverContext();

  const [
    {
      summaryImage: {
        style: { vertPosition, aspectRatio },
      },
    },
    { updateSummaryImageAspectRatio },
  ] = useArticleContext();

  return (
    <ResizeImage
      aspectRatio={aspectRatio}
      onAspectRatioChange={(aspectRatio) => {
        updateSummaryImageAspectRatio({ aspectRatio });
      }}
    >
      <CustomSectionArticleImageUI
        image={
          <ImageWrapper
            imgId={imgId}
            objectFit="cover"
            vertPosition={vertPosition}
          />
        }
        menu={<ImageMenu />}
        {...hoverHandlers}
      />
    </ResizeImage>
  );
};

const CustomSectionArticleImageUI = ({
  image,
  menu,
  onMouseEnter,
  onMouseLeave,
}: {
  image: ReactElement;
  menu: ReactElement;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) => (
  <div
    css={[tw`relative h-full w-full`]}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    {image}
    {/* below is css workaround - couldn't get menu to not stretch */}
    <div css={[tw`absolute flex flex-col items-start`]}>{menu}</div>
  </div>
);

const ImageMenu = () => {
  const [containerIsHovered] = useHoverContext();

  const [
    { summaryImage },
    {
      updateSummaryImageVertPosition,
      updateSummaryImageSrc,
      toggleUseSummaryImage,
    },
  ] = useArticleContext();
  const vertPosition = summaryImage.style.vertPosition;

  const canFocusLower = vertPosition < 100;
  const canFocusHigher = vertPosition > 0;

  const positionChangeAmount = 10;

  const focusHigher = () => {
    if (!canFocusHigher) {
      return;
    }
    const updatedPosition = vertPosition - positionChangeAmount;
    updateSummaryImageVertPosition({ vertPosition: updatedPosition });
  };
  const focusLower = () => {
    if (!canFocusLower) {
      return;
    }
    const updatedPosition = vertPosition + positionChangeAmount;
    updateSummaryImageVertPosition({ vertPosition: updatedPosition });
  };

  const updateImageSrc = (imgId: string) => updateSummaryImageSrc({ imgId });

  return (
    <ImageMenuUI
      canFocusHigher={canFocusHigher}
      canFocusLower={canFocusLower}
      focusHigher={focusHigher}
      focusLower={focusLower}
      updateImageSrc={updateImageSrc}
      show={containerIsHovered}
      additionalButtons={
        <>
          <ContentMenuVerticalBar />
          <ImageMenuRemoveButton removeImage={toggleUseSummaryImage} />
        </>
      }
    />
  );
};

const ImageMenuRemoveButton = ({
  removeImage,
}: {
  removeImage: () => void;
}) => (
  <WithWarning
    callbackToConfirm={removeImage}
    warningText="Remove summary image?"
    type="moderate"
  >
    <ContentMenuButton tooltipProps={{ text: "remove summary image" }}>
      <Trash />
    </ContentMenuButton>
  </WithWarning>
);

const CustomSectionArticleTitleUI = ({
  title,
}: {
  title: string | undefined;
}) => (
  <h3 css={[tw`text-3xl`]}>
    {title ? (
      title
    ) : (
      <div css={[tw`flex items-center gap-sm`]}>
        <span css={[tw`text-gray-placeholder`]}>title...</span>
        <MissingText tooltipText="missing title for language" />
      </div>
    )}
  </h3>
);

const CustomSectionArticleSummary = () => {
  const [{ id: articleId }] = useArticleContext();
  const [translation] = useArticleTranslationContext();
  // console.log(translation);

  const summary = getArticleSummaryFromTranslation({
    summaryType: "user",
    translation,
  });
  console.log("summary:", summary);
  const editorInitialContent = summary ? summary : undefined;

  const dispatch = useDispatch();

  const updateSummary = (text: JSONContent) =>
    dispatch(
      updateSummaryAction({
        id: articleId,
        summary: text,
        summaryType: "custom",
        translationId: translation.id,
      })
    );

  return (
    <CustomSectionArticleSummaryUI
      editor={
        <SimpleTipTapEditor
          initialContent={editorInitialContent}
          onUpdate={updateSummary}
          placeholder="summary here..."
          key={translation.id}
        />
      }
      isContent={Boolean(summary)}
    />
  );
};

const CustomSectionArticleSummaryUI = ({
  editor,
  isContent,
}: {
  editor: ReactElement;
  isContent: boolean;
}) => (
  <div css={[tw`relative`]}>
    <div>{editor}</div>
    {!isContent ? (
      <div css={[tw`absolute right-0 top-0`]}>
        <MissingText tooltipText="Missing summary text for translation" />
      </div>
    ) : null}
  </div>
);
