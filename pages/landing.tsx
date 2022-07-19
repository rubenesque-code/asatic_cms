import { NextPage } from "next";
import { ReactElement, useState } from "react";
import {
  ArrowBendLeftDown,
  ArrowBendRightUp,
  ArrowDown,
  ArrowRight,
  ArrowsInLineHorizontal,
  ArrowsOutLineHorizontal,
  ArrowUp,
  CaretLeft,
  CaretRight,
  Image as ImageIcon,
  Plus,
  PlusCircle,
  Trash,
  WarningCircle,
} from "phosphor-react";
import tw, { css, TwStyle } from "twin.macro";
import { JSONContent } from "@tiptap/react";
import { useMeasure } from "react-use";

import { useDispatch, useSelector } from "^redux/hooks";
import {
  removeOne as deleteSectionAction,
  moveDown as moveDownAction,
  moveUp as moveUpAction,
  selectTotal as selectTotalLandingSections,
  selectById as selectLandingSectionById,
  selectIds as selectLandingSectionsIds,
  addCustomComponent,
} from "^redux/state/landing";
import {
  selectAll as selectArticles,
  updateSummary as updateSummaryAction,
  selectById as selectArticleById,
} from "^redux/state/articles";
import { selectEntitiesByIds as selectAuthorsByIds } from "^redux/state/authors";

import { Collection } from "^lib/firebase/firestore/collectionKeys";

import {
  formatDateDMYStr,
  mapIds,
  orderSortableComponents,
} from "^helpers/general";
import {
  computeTranslationForActiveLanguage,
  getArticleSummaryFromTranslation,
  getArticleSummaryImageId,
} from "^helpers/article";

import useSearchLandingContent from "^hooks/pages/useLandingContent";

import {
  LandingCustomSectionProvider,
  useLandingCustomSectionContext,
} from "^context/LandingCustomSectionContext";
import {
  ActiveLanguageProvider,
  useActiveLanguageContext,
} from "^context/ActiveLanguageContext";
import { ArticleProvider, useArticleContext } from "^context/ArticleContext";
import {
  ArticleTranslationProvider,
  useArticleTranslationContext,
} from "^context/ArticleTranslationContext";
import {
  ArticleTranslationWithActionsProvider,
  useArticleTranslationWithActionsContext,
} from "^context/ArticleTranslationWithActionsContext.tsx";
import {
  LandingCustomSectionComponentProvider,
  useLandingCustomSectionComponentContext,
} from "^context/LandingCustomSectionComponentContext";
import {
  HoverHandlers,
  HoverProvider,
  useHoverContext,
} from "^context/ParentHoverContext";

import {
  LandingSectionAuto,
  LandingSectionCustom,
  LandingSectionCustomComponent,
} from "^types/landing";

import Head from "^components/Head";
import QueryDatabase from "^components/QueryDatabase";
import WithProximityPopover from "^components/WithProximityPopover";
import WithTooltip from "^components/WithTooltip";
import MissingText from "^components/MissingText";
import SimpleTipTapEditor from "^components/editors/tiptap/SimpleEditor";
import WithWarning from "^components/WithWarning";
import ContentInputWithSelect from "^components/ContentInputWithSelect";
import DndSortableContext from "^components/dndkit/DndSortableContext";
import DndSortableElement from "^components/dndkit/DndSortableElement";
import AddItemButton from "^components/buttons/AddItem";
import LandingSwiper from "^components/swipers/Landing";
import ImageWrapper from "^components/images/Wrapper";
import ResizeImage from "^components/resize/Image";
import WithAddDocImage from "^components/WithAddDocImage";
import UserCreatedIcon from "^components/icons/UserCreated";
import SiteLanguagePopover from "^components/header/SiteLanguage";
import Header from "^components/pages/landing/Header";
import WithAddSection from "^components/pages/landing/WithAddSection";

import { s_editorMenu } from "^styles/menus";
import s_transition from "^styles/transition";
import { s_popover } from "^styles/popover";
import EmptySectionsUI from "^components/pages/landing/EmptySectionsUI";
import WithAddCustomSectionComponentInitial from "^components/pages/landing/WithAddCustomSectionComponent";

// todo: info somewhere about order of showing translations
// todo: choose font-serif. Also affects article font sizing
// todo: handle component borders
// todo: article validation?

// todo: extend tiptap content type for image

// todo: image node type written twice on an article

// todo: asserting context value as {} leads to useContext check to not work

// todo: selectEntitiesByIds assertion in each state type is probably not safe and not good practice

// todo: NICE TO HAVES
// todo: select from article images on article image button
// todo: order auto-section components to show those not in custom sections.

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
      <ActiveLanguageProvider>
        <>
          <Header siteLanguage={<SiteLanguage />} />
          <MainContainer>
            <Main />
          </MainContainer>
        </>
      </ActiveLanguageProvider>
    </div>
  );
};

const SiteLanguage = () => {
  const { activeLanguageId, setActiveLanguageId } = useActiveLanguageContext();

  return (
    <SiteLanguagePopover
      languageId={activeLanguageId}
      onUpdateLanguage={setActiveLanguageId}
    />
  );
};

const MainContainer = ({ children }: { children: ReactElement }) => {
  const [containerRef, { height: containerHeight }] =
    useMeasure<HTMLDivElement>();

  const height = containerHeight * 0.95;

  return (
    <div
      css={[
        tw`h-full grid place-items-center bg-gray-50 border-t-2 border-gray-200`,
      ]}
      ref={containerRef}
    >
      {height ? (
        <div
          css={[tw`w-[95%] max-w-[1200px] overflow-y-auto bg-white shadow-md`]}
          style={{ height }}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
};

const Main = () => {
  const numSections = useSelector(selectTotalLandingSections);

  return <MainUI content={numSections ? <Sections /> : <EmptySections />} />;
};

const MainUI = ({ content }: { content: ReactElement }) => (
  <main css={[tw`pt-xl pb-lg`]}>{content}</main>
);

const EmptySections = () => (
  <EmptySectionsUI
    addSectionButton={
      <WithAddSection sectionToAddIndex={0}>
        <AddItemButton>Add section</AddItemButton>
      </WithAddSection>
    }
  />
);

const Sections = () => {
  const [sectionHoveredIndex, setSectionHoveredIndex] = useState<number | null>(
    null
  );
  const setSectionHoveredToNull = () => setSectionHoveredIndex(null);

  const sectionIds = useSelector(selectLandingSectionsIds) as string[];

  return (
    <>
      <BetweenSectionsMenu
        sectionToAddIndex={0}
        show={sectionHoveredIndex === 0}
      />
      {sectionIds.map((id, i) => (
        <Section
          addSectionMenu={
            <BetweenSectionsMenu
              sectionToAddIndex={i + 1}
              show={sectionHoveredIndex === i}
            />
          }
          container={({ content }) => (
            <div
              onMouseEnter={() => setSectionHoveredIndex(i)}
              onMouseLeave={setSectionHoveredToNull}
            >
              {content}
            </div>
          )}
          index={i}
          sectionId={id}
          showMenu={sectionHoveredIndex === i}
          key={id}
        />
      ))}
    </>
  );
};

const BetweenSectionsMenu = ({
  sectionToAddIndex,
  show,
}: {
  sectionToAddIndex: number;
  show: boolean;
}) => {
  return (
    <BetweenSectionsMenuUI
      show={show}
      addSectionButton={
        <BetweenSectionsMenuAddSectionButton
          sectionToAddIndex={sectionToAddIndex}
        />
      }
    />
  );
};

type BetweenSectionsMenuUIProps = {
  show: boolean;
  addSectionButton: ReactElement;
};

const BetweenSectionsMenuUI = ({
  show,
  addSectionButton,
}: BetweenSectionsMenuUIProps) => (
  <div
    css={[
      tw`relative z-30 hover:z-40 h-[10px]`,
      s_transition.toggleVisiblity(show),
      tw`opacity-40 hover:opacity-100`,
    ]}
  >
    <div
      css={[tw`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`]}
    >
      {addSectionButton}
    </div>
  </div>
);

const BetweenSectionsMenuAddSectionButton = ({
  sectionToAddIndex,
}: {
  sectionToAddIndex: number;
}) => (
  <WithAddSection sectionToAddIndex={sectionToAddIndex}>
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
  </WithAddSection>
);

const Section = ({
  addSectionMenu,
  index,
  sectionId,
  container,
  showMenu,
}: {
  addSectionMenu: ReactElement;
  index: number;
  sectionId: string;
  container: ({ content }: { content: ReactElement }) => ReactElement;
  showMenu: boolean;
}) => {
  const numSections = useSelector(selectTotalLandingSections);
  const section = useSelector((state) =>
    selectLandingSectionById(state, sectionId)
  )!;

  const menuProps = {
    canMoveDown: section.order < numSections,
    canMoveUp: index > 0,
    sectionId: section.id,
    show: showMenu,
  };

  return (
    <>
      {container({
        content:
          section.type === "auto" ? (
            <AutoSection3
              menu={<SectionMenu {...menuProps} />}
              section={section}
            />
          ) : (
            <CustomSection section={section} />
          ),
      })}
      {addSectionMenu}
    </>
  );
};

type SectionMenuProps = {
  sectionId: string;
} & SectionMenuPropsPassed;
type SectionMenuPropsPassed = Pick<
  SectionMenuUIProps,
  "canMoveDown" | "canMoveUp" | "extraButtons" | "show"
>;

const SectionMenu = ({ sectionId, ...uiProps }: SectionMenuProps) => {
  const dispatch = useDispatch();

  const deleteSection = () => dispatch(deleteSectionAction({ id: sectionId }));

  const moveDown = () => dispatch(moveDownAction({ id: sectionId }));

  const moveUp = () => dispatch(moveUpAction({ id: sectionId }));

  return (
    <SectionMenuUI
      deleteSection={deleteSection}
      moveDown={moveDown}
      moveUp={moveUp}
      {...uiProps}
    />
  );
};

type SectionMenuUIProps = {
  show: boolean;
  canMoveDown: boolean;
  canMoveUp: boolean;
  deleteSection: () => void;
  extraButtons?: ReactElement | null;
  moveDown: () => void;
  moveUp: () => void;
  bgStyle?: TwStyle;
};

const SectionMenuUI = ({
  canMoveDown,
  canMoveUp,
  deleteSection,
  moveDown,
  moveUp,
  extraButtons,
  bgStyle,
  show,
}: SectionMenuUIProps) => (
  <div
    css={[
      s_menu.container,
      tw`opacity-50 hover:opacity-100 text-gray-400 hover:text-black transition-opacity ease-in-out duration-75`,
      !show && tw`opacity-0`,
      tw`-translate-y-full`,
      bgStyle,
    ]}
  >
    {extraButtons ? extraButtons : null}
    <WithTooltip text="move section down" type="action">
      <button
        css={[s_menu.button({ isDisabled: !canMoveDown })]}
        onClick={moveDown}
        type="button"
      >
        <ArrowDown />
      </button>
    </WithTooltip>
    <WithTooltip text="move section up" type="action">
      <button
        css={[s_menu.button({ isDisabled: !canMoveUp })]}
        onClick={moveUp}
        type="button"
      >
        <ArrowUp />
      </button>
    </WithTooltip>
    <div css={[s_menu.verticalBar]} />
    <WithWarning
      callbackToConfirm={deleteSection}
      warningText={{ heading: "Delete section?" }}
    >
      <WithTooltip text="delete section" type="action">
        <button css={[s_menu.button()]} type="button">
          <Trash />
        </button>
      </WithTooltip>
    </WithWarning>
  </div>
);

// ${args ? s_transition.toggleVisiblity(args.show ) : null}
// container: (args: { show: boolean } | void ) =>

const s_menu = {
  container: css`
    ${tw`absolute top-0 right-0 z-30 px-sm py-xs inline-flex items-center gap-sm bg-white rounded-md shadow-md border`}
  `,
  button: (args: { isDisabled?: boolean } | void) => css`
    ${s_editorMenu.button.button} ${tw`text-[15px]`} ${args?.isDisabled &&
    s_editorMenu.button.disabled}
  `,
  verticalBar: tw`w-[0.5px] h-[15px] bg-gray-200`,
};

const AutoSection3 = ({
  menu,
  section,
}: {
  menu: ReactElement;
  section: LandingSectionAuto;
}) => {
  return (
    <AutoSectionContainerUI menu={menu}>
      <AutoSectionSwitch contentType={section.contentType} />
    </AutoSectionContainerUI>
  );
};

const AutoSectionContainerUI = ({
  children,
  menu,
}: {
  children: ReactElement;
  menu: ReactElement;
}) => {
  return (
    <div>
      {children}
      {menu}
    </div>
  );
};

const AutoSectionSwitch = ({
  contentType,
}: {
  contentType: LandingSectionAuto["contentType"];
}) => {
  if (contentType === "article") {
    return <AutoArticleSectionUI articlesSwiper={<ArticlesSwiper />} />;
  }

  throw new Error("section content type not handled");
};

const AutoArticleSectionUI = ({
  articlesSwiper,
}: {
  articlesSwiper: ReactElement;
}) => {
  return (
    <div css={[tw`bg-blue-light-content font-serif-eng`]}>
      <h3
        css={[
          tw`pl-xl pt-sm pb-xs text-blue-dark-content text-2xl border-b-0.5 border-gray-400`,
        ]}
      >
        From Articles
      </h3>
      <div css={[tw`ml-lg z-10`]}>{articlesSwiper} </div>
    </div>
  );
};

const ArticlesSwiper = () => {
  const articles = useSelector(selectArticles);

  return (
    <LandingSwiper
      elements={articles.map((article) => (
        <ArticleProvider article={article} key={article.id}>
          <AutoSectionArticle />
        </ArticleProvider>
      ))}
      navButtons={
        articles.length > 3
          ? ({ swipeLeft, swipeRight }) => (
              <div
                css={[
                  tw`z-20 absolute top-0 right-0 min-w-[110px] h-full bg-blue-light-content bg-opacity-80 flex flex-col justify-center`,
                ]}
              >
                <div css={[tw`-translate-x-sm`]}>
                  <button
                    css={[
                      tw`p-xs bg-white opacity-60 hover:opacity-90 text-3xl`,
                    ]}
                    onClick={swipeLeft}
                    type="button"
                  >
                    <CaretLeft />
                  </button>
                  <button
                    css={[tw`p-xs bg-white text-3xl`]}
                    onClick={swipeRight}
                    type="button"
                  >
                    <CaretRight />
                  </button>
                </div>
              </div>
            )
          : null
      }
    />
  );
};

// todo: handle: incomplete, draft.
const AutoSectionArticle = () => {
  const [{ id: articleId, translations }] = useArticleContext();
  const { activeLanguageId } = useActiveLanguageContext();

  const translationToUse = computeTranslationForActiveLanguage(
    translations,
    activeLanguageId
  );

  return (
    <ArticleTranslationWithActionsProvider
      translation={translationToUse}
      articleId={articleId}
    >
      <AutoSectionArticleUI
        publishDate={<AutoSectionArticlePublishDate />}
        title={<AutoSectionArticleTitle />}
        authors={<AutoSectionArticleAuthors />}
        short={<AutoSectionArticleSummary />}
      />
    </ArticleTranslationWithActionsProvider>
  );
};

// todo: could be no authors so is margin issue below...
const AutoSectionArticleUI = ({
  publishDate,
  short,
  title,
  authors,
}: {
  title: ReactElement;
  authors?: ReactElement;
  publishDate: ReactElement;
  short: ReactElement;
}) => {
  return (
    <div css={[tw`relative p-sm border-l-0.5 border-gray-400 h-full`]}>
      <div>{title}</div>
      <div css={[tw`mt-xxxs`]}>{authors}</div>
      <div css={[tw`mt-xs`]}>{publishDate}</div>
      <div css={[tw`mt-xs`]}>{short}</div>
    </div>
  );
};

const AutoSectionArticleAuthors = () => {
  const [{ authorIds }] = useArticleContext();
  const [{ languageId }] = useArticleTranslationWithActionsContext();

  const authors = useSelector((state) => selectAuthorsByIds(state, authorIds));

  if (!authorIds.length) {
    return null;
  }

  const authorsTranslationsForLanguage = authors.map((author) =>
    author.translations.find((t) => t.languageId === languageId)
  );

  return (
    <AutoSectionArticleAuthorsUI
      authors={authorsTranslationsForLanguage.map((a, i) => (
        <AutoSectionArticleAuthorUI
          author={a?.name}
          isAFollowingAuthor={i < authors.length - 1}
          key={a?.id}
        />
      ))}
    />
  );
};

const AutoSectionArticleAuthorsUI = ({
  authors,
}: {
  authors: ReactElement[];
}) => {
  return <div css={[tw`flex gap-xs`]}>{authors}</div>;
};

const AutoSectionArticleAuthorUI = ({
  author,
  isAFollowingAuthor,
}: {
  author: string | undefined;
  isAFollowingAuthor: boolean;
}) => (
  <h4 css={[tw`text-gray-700 text-2xl`]}>
    {author ? (
      <>
        <span>{author}</span>
        {isAFollowingAuthor ? ", " : null}
      </>
    ) : (
      <span css={[tw`flex`]}>
        <span css={[tw`text-gray-placeholder mr-sm`]}>author...</span>
        <MissingText tooltipText="missing author translation for language" />
        {isAFollowingAuthor ? (
          <span css={[tw`text-gray-placeholder`]}>,</span>
        ) : null}
      </span>
    )}
  </h4>
);

const AutoSectionArticlePublishDate = () => {
  const [
    {
      publishInfo: { date },
    },
  ] = useArticleContext();
  const dateStr = date ? formatDateDMYStr(date) : null;

  return <AutoSectionArticlePublishDateUI date={dateStr} />;
};

const AutoSectionArticlePublishDateUI = ({ date }: { date: string | null }) => (
  <p css={[tw`font-sans tracking-wide font-light`]}>
    {date ? (
      date
    ) : (
      <span css={[tw`flex items-center gap-sm`]}>
        <span css={[tw`text-gray-placeholder`]}>date...</span>
        <MissingText tooltipText="missing publish date" />
      </span>
    )}
  </p>
);

const AutoSectionArticleTitle = () => {
  const [{ title }] = useArticleTranslationWithActionsContext();

  return <AutoSectionArticleTitleUI title={title} />;
};

const AutoSectionArticleTitleUI = ({
  title,
}: {
  title: string | undefined;
}) => (
  <h3 css={[tw`text-blue-dark-content text-3xl`]}>
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

const AutoSectionArticleSummary = () => {
  const [translation, { updateSummary }] =
    useArticleTranslationWithActionsContext();

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
        />
      }
      isContent={Boolean(isInitialContent)}
    />
  );
};

const AutoSectionArticleSummaryUI = ({
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
  }) => dispatch(addCustomComponent({ docId, sectionId, type }));

  return (
    <WithAddCustomSectionComponentInitial addComponent={addComponent}>
      {children}
    </WithAddCustomSectionComponentInitial>
  );
};

const CustomSectionMenuExtraButtonsUI = () => (
  <>
    <WithAddCustomSectionComponent>
      <WithTooltip text="add content">
        <button css={[s_menu.button()]} type="button">
          <Plus />
        </button>
      </WithTooltip>
    </WithAddCustomSectionComponent>
    <div css={[s_menu.verticalBar]} />
  </>
);

// CUSTOM SECTION

const CustomSection = ({
  // menu,
  section,
}: {
  // menu: ReactElement;
  section: LandingSectionCustom;
}) => {
  const isContent = section.components.length;

  const numSections = useSelector(selectTotalLandingSections);

  const canMoveDown = section.order < numSections;
  const canMoveUp = section.order > 1;
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
              show={true}
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

const AddCustomSectionImage = () => {
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
    return <AddCustomSectionImageUI addImage={addImage} />;
  }

  return null;
};

const AddCustomSectionImageUI = ({
  addImage,
}: {
  addImage: (id: string) => void;
}) => (
  <>
    <WithAddDocImage onAddImage={({ id }) => addImage(id)}>
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
  console.log("article:", article);

  const { activeLanguageId } = useActiveLanguageContext();

  const translation = article
    ? computeTranslationForActiveLanguage(
        article.translations,
        activeLanguageId
      )
    : null;

  return article ? (
    <ArticleProvider article={article}>
      <ArticleTranslationProvider translation={translation!}>
        <CustomSectionComponentContainer
          menu={
            <CustomSectionComponentMenu addImage={<AddCustomSectionImage />} />
          }
        >
          <CustomSectionArticle />
        </CustomSectionComponentContainer>
      </ArticleTranslationProvider>
    </ArticleProvider>
  ) : (
    <CustomSectionComponentContainer menu={<CustomSectionComponentMenu />}>
      <CustomSectionArticleInvalidUI />
    </CustomSectionComponentContainer>
  );
};

// todo: delete component.
// todo: menu for invalid components

const CustomSectionArticleInvalidUI = () => (
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
        Invalid article
      </h4>
      <p css={[tw`mt-sm text-sm text-gray-700`]}>
        This component references an article that can&apos;t be found. <br /> It
        has probably been deleted by a user, but you can try refreshing the
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
        style: { vertPosition, widthToHeight },
      },
    },
    { updateSummaryImageAspectRatio },
  ] = useArticleContext();

  return (
    <ResizeImage
      aspectRatio={widthToHeight}
      onAspectRatioChange={(updatedRatio) => {
        updateSummaryImageAspectRatio({ aspectRatio: updatedRatio });
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
      removeImage={toggleUseSummaryImage}
      show={containerIsHovered}
    />
  );
};

const ImageMenuUI = ({
  canFocusHigher,
  canFocusLower,
  focusHigher,
  focusLower,
  updateImageSrc,
  removeImage,
  show,
}: {
  updateImageSrc: (imgId: string) => void;
  focusLower: () => void;
  focusHigher: () => void;
  canFocusLower: boolean;
  canFocusHigher: boolean;
  removeImage: () => void;
  show: boolean;
}) => (
  <div
    css={[
      s_menu.container,
      tw`left-0 inline-flex w-auto static`,
      tw`opacity-50 hover:opacity-100 text-gray-400 hover:text-black transition-opacity ease-in-out duration-75`,
      !show && tw`opacity-0`,
    ]}
  >
    <WithTooltip text="focus lower">
      <button
        css={[s_menu.button({ isDisabled: !canFocusLower })]}
        onClick={focusLower}
        type="button"
      >
        <ArrowBendLeftDown />
      </button>
    </WithTooltip>
    <WithTooltip text="focus higher">
      <button
        css={[s_menu.button({ isDisabled: !canFocusHigher })]}
        onClick={focusHigher}
        type="button"
      >
        <ArrowBendRightUp />
      </button>
    </WithTooltip>
    <div css={[s_menu.verticalBar]} />
    <WithAddDocImage onAddImage={({ id }) => updateImageSrc(id)}>
      <WithTooltip text="change image">
        <button css={[s_menu.button()]} type="button">
          <ImageIcon />
        </button>
      </WithTooltip>
    </WithAddDocImage>
    <div css={[s_menu.verticalBar]} />
    <WithWarning
      callbackToConfirm={removeImage}
      warningText="Remove summary image?"
      type="moderate"
    >
      <WithTooltip text="remove summary image">
        <button css={[s_menu.button()]} type="button">
          <Trash />
        </button>
      </WithTooltip>
    </WithWarning>
  </div>
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

  const summary = getArticleSummaryFromTranslation({
    summaryType: "user",
    translation,
  });
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
