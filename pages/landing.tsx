import { NextPage } from "next";
import { ReactElement, useState } from "react";
import {
  Check,
  CloudArrowUp,
  FilePlus,
  PlusCircle,
  Robot,
  SquaresFour,
  Translate,
  User,
  Wrench,
} from "phosphor-react";
import tw from "twin.macro";
import { RadioGroup } from "@headlessui/react";
import { JSONContent } from "@tiptap/react";

import { useDispatch, useSelector } from "^redux/hooks";
import {
  selectById,
  selectEntitiesByIds as selectLanguagesByIds,
} from "^redux/state/languages";
import { addOne as addLandingSection } from "^redux/state/landing";
import { selectAll as selectAllArticles } from "^redux/state/articles";

import { Collection } from "^lib/firebase/firestore/collectionKeys";

import {
  default_language_Id,
  second_default_language_Id,
  siteLanguageIDsArr,
} from "^constants/data";

import useLandingPageTopControls from "^hooks/pages/useLandingPageTopControls";
import { useLeavePageConfirm } from "^hooks/useLeavePageConfirm";

import {
  ActiveLanguageProvider,
  useActiveLanguageContext,
} from "^context/ActiveLanguageContext";

import { Language } from "^types/language";

import Head from "^components/Head";
import SaveButtonUI from "^components/header/SaveButtonUI";
import SaveTextUI from "^components/header/SaveTextUI";
import SideBar from "^components/header/SideBar";
import UndoButtonUI from "^components/header/UndoButtonUI";
import QueryDatabase from "^components/QueryDatabase";
import WithProximityPopover from "^components/WithProximityPopover";
import WithTooltip from "^components/WithTooltip";

import { s_header } from "^styles/header";
import s_button from "^styles/button";
import { s_popover } from "^styles/popover";
import {
  selectAll as selectAllLandingSections,
  selectTotal as selectTotalLandingSections,
} from "^redux/state/landing";
import AddItemButton from "^components/buttons/AddItem";
import { s_editorMenu } from "^styles/menus";
import { LandingSectionAuto } from "^types/landing";
import LandingSwiper from "^components/swipers/Landing";
import { Article } from "^types/article";
import { selectEntitiesByIds as selectAuthorsByIds } from "^redux/state/authors";
import {
  formatDateDMYStr,
  getJSONContentFirstParagraph,
} from "^helpers/general";
import MissingText from "^components/MissingText";
import { Author } from "^types/author";
import SimpleTipTapEditor from "^components/editors/tiptap/SimpleEditor";

// todo: info somewhere about order of showing translations

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
          <Header />
          <MainContainer />
        </>
      </ActiveLanguageProvider>
    </div>
  );
};

const Header = () => {
  const { handleSave, handleUndo, isChange, saveMutationData } =
    useLandingPageTopControls();

  useLeavePageConfirm({ runConfirmOn: isChange });

  return (
    <header css={[s_header.container, tw`border-b`]}>
      <div css={[tw`flex items-center gap-md`]}>
        <SideBar />
        <div css={[s_header.spacing]}>
          <LanguageSelect />
          <SaveTextUI isChange={isChange} saveMutationData={saveMutationData} />
        </div>
      </div>
      <div css={[s_header.spacing]}>
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
        <button css={[s_header.button]}>
          <CloudArrowUp />
        </button>
      </div>
    </header>
  );
};

const LanguageSelect = () => {
  const { activeLanguageId } = useActiveLanguageContext();
  const language = useSelector((state) => selectById(state, activeLanguageId))!;

  return (
    <WithProximityPopover panelContentElement={<LanguageSelectPanel />}>
      <LanguageSelectButtonUI languageName={language.name} />
    </WithProximityPopover>
  );
};

const LanguageSelectButtonUI = ({ languageName }: { languageName: string }) => {
  return (
    <WithTooltip text="site language" placement="right">
      <button css={[tw`flex gap-xxxs items-center`]}>
        <span css={[s_button.subIcon, tw`text-sm -translate-y-1`]}>
          <Translate />
        </span>
        <span css={[tw`text-sm`]}>{languageName}</span>
      </button>
    </WithTooltip>
  );
};

const LanguageSelectPanel = () => {
  const { activeLanguageId, setActiveLanguageId } = useActiveLanguageContext();

  const siteLanguages = useSelector((state) =>
    selectLanguagesByIds(state, siteLanguageIDsArr)
  ) as Language[];

  const value = siteLanguages.find(
    (language) => language.id === activeLanguageId
  ) as Language;

  const setValue = (language: Language) => setActiveLanguageId(language.id);

  return (
    <LanguageSelectPanelUI
      languages={
        <LanguageSelectLanguages
          languages={siteLanguages}
          setValue={setValue}
          value={value}
        />
      }
    />
  );
};

const LanguageSelectPanelUI = ({ languages }: { languages: ReactElement }) => {
  return (
    <div css={[s_popover.panelContainer]}>
      <div>
        <h4 css={[tw`font-medium text-lg`]}>Site language</h4>
        <p css={[tw`text-gray-600 mt-xs text-sm`]}>
          Determines the language the site is shown in. For translatable
          documents, e.g. articles, the site will show the relevant translation
          if it exists.
        </p>
      </div>
      <div css={[tw`flex flex-col gap-lg items-start`]}>{languages}</div>
    </div>
  );
};

const LanguageSelectLanguages = ({
  languages,
  setValue,
  value,
}: {
  languages: Language[];
  value: Language;
  setValue: (language: Language) => void;
}) => {
  return (
    <RadioGroup
      as="div"
      css={[tw`flex items-center gap-md`]}
      value={value}
      onChange={setValue}
    >
      <div css={[tw`flex items-center gap-lg`]}>
        {languages.map((language) => (
          <RadioGroup.Option value={language} key={language.id}>
            {({ checked }) => (
              <WithTooltip
                text={checked ? "active language" : "make active"}
                type={checked ? "info" : "action"}
              >
                <div css={[tw`flex items-center gap-xs`]}>
                  {checked ? (
                    <span css={[tw`text-green-active `]}>
                      <Check />
                    </span>
                  ) : null}
                  <span
                    css={[checked ? tw`text-green-active` : tw`cursor-pointer`]}
                  >
                    {language.name}
                  </span>
                </div>
              </WithTooltip>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
};

const MainContainer = () => {
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>();
  const containerHeight = containerRef?.clientHeight;
  // const initialContainerHeight = usePrevious(containerHeight);
  // console.log("initialContainerHeight:", initialContainerHeight);

  return (
    <div
      css={[
        tw`h-full grid place-items-center bg-gray-50 border-t-2 border-gray-200`,
      ]}
    >
      <div css={[tw`w-[95%] max-w-[1200px] h-[95%]`]} ref={setContainerRef}>
        {containerHeight ? (
          <div
            css={[tw`overflow-y-auto bg-white shadow-md`]}
            style={{ height: containerHeight }}
          >
            <Main />
          </div>
        ) : null}
      </div>
    </div>
  );
};

const Main = () => {
  const numSections = useSelector(selectTotalLandingSections);

  return (
    <main css={[tw`bg-white py-lg`]}>
      {numSections ? <Sections /> : <Empty />}
    </main>
  );
};

const Empty = () => {
  return (
    <div css={[tw`text-center`]}>
      <div css={[tw` relative text-gray-400 inline-flex items-center`]}>
        <span css={[tw`text-4xl`]}>
          <SquaresFour />
        </span>
        <span css={[tw`absolute bottom-0 right-0 bg-white text-lg`]}>
          <PlusCircle weight="bold" />
        </span>
      </div>
      <div css={[tw``]}>
        <p css={[tw`font-medium`]}>No sections</p>
        <p css={[tw`mt-xs text-gray-600`]}>
          Get started building the landing page
        </p>
      </div>
      <div css={[tw`mt-lg`]}>
        <WithAddSection>
          <AddItemButton>Add section</AddItemButton>
        </WithAddSection>
      </div>
    </div>
  );
};

const WithAddSection = ({ children }: { children: ReactElement }) => {
  return (
    <WithProximityPopover
      panelContentElement={
        <AddSectionPanelUI
          addAutoCreatedButton={<AddAutoCreatedPopover />}
          addUserCreated={() => null}
        />
      }
    >
      {children}
    </WithProximityPopover>
  );
};

const AddSectionPanelUI = ({
  addAutoCreatedButton,
  addUserCreated,
}: {
  addUserCreated: () => void;
  addAutoCreatedButton: ReactElement;
}) => {
  return (
    <div
      css={[
        tw`px-sm py-xs flex items-center gap-md bg-white rounded-md shadow-md border`,
      ]}
    >
      <WithTooltip
        text={{
          header: "user-created",
          body: "Add any type of document and edit its size.",
        }}
        type="action"
      >
        <button
          css={[s_editorMenu.button.button, tw`relative`]}
          onClick={addUserCreated}
          type="button"
        >
          <span>
            <User />
          </span>
          <span
            css={[tw`absolute bottom-0.5 -right-0.5 text-xs text-gray-800`]}
          >
            <Wrench />
          </span>
        </button>
      </WithTooltip>
      {addAutoCreatedButton}
    </div>
  );
};

const AddAutoCreatedPopover = () => {
  return (
    <WithProximityPopover
      panelContentElement={<AddAutoCreatedPanel />}
      placement="bottom-start"
    >
      <WithTooltip
        text={{
          header: "auto-generated",
          body: "Choose from document types, e.g. articles, and a swipeable section will be created.",
        }}
      >
        <button css={[s_editorMenu.button.button, tw`relative`]} type="button">
          <span>
            <Robot />
          </span>
          <span css={[tw`absolute bottom-0.5 -right-1 text-xs text-gray-800`]}>
            <Wrench />
          </span>
        </button>
      </WithTooltip>
    </WithProximityPopover>
  );
};

const contentSectionData: {
  contentType: LandingSectionAuto["contentType"];
  text: string;
}[] = [
  {
    contentType: "article",
    text: "articles",
  },
];

const AddAutoCreatedPanel = () => {
  const sections = useSelector(selectAllLandingSections);
  const autoSections = sections.filter(
    (s) => s.type === "auto"
  ) as LandingSectionAuto[];

  const sectionIsUsed = (contentType: LandingSectionAuto["contentType"]) => {
    const usedAutoSectionsTypes = autoSections.map((s) => s.contentType);

    const isUsed = usedAutoSectionsTypes.includes(contentType);

    return isUsed;
  };

  const dispatch = useDispatch();

  const addAutoSection = (contentType: LandingSectionAuto["contentType"]) =>
    dispatch(addLandingSection({ type: "auto", contentType }));

  return (
    <AddAutoCreatedPanelUI
      addSectionButtons={
        <>
          {contentSectionData.map((s) => (
            <AddAutoCreatedSectionUI
              addToLanding={() => addAutoSection(s.contentType)}
              isUsed={sectionIsUsed(s.contentType)}
              text={s.text}
              key={s.contentType}
            />
          ))}
        </>
      }
    />
  );
};

const AddAutoCreatedPanelUI = ({
  addSectionButtons,
}: {
  addSectionButtons: ReactElement;
}) => {
  return (
    <div
      css={[
        tw`text-left py-sm flex flex-col gap-md bg-white rounded-md shadow-md border`,
      ]}
    >
      {addSectionButtons}
    </div>
  );
};

const AddAutoCreatedSectionUI = ({
  addToLanding,
  isUsed,
  text,
}: {
  addToLanding: () => void;
  isUsed: boolean;
  text: string;
}) => {
  return (
    <button
      css={[
        tw`flex items-center gap-sm py-0.5 px-md text-gray-700`,
        isUsed && tw`cursor-auto text-gray-400`,
      ]}
      onClick={() => !isUsed && addToLanding()}
      type="button"
    >
      <span css={[tw`whitespace-nowrap`]}>{text}</span>
      {/* <span css={[tw`whitespace-nowrap`]}>Article section</span> */}
      <span>
        <FilePlus />
      </span>
    </button>
  );
};

const Sections = () => {
  const sections = useSelector(selectAllLandingSections);

  return (
    <div>
      {sections.map((s) =>
        s.type === "auto" ? (
          <AutoSectionSwitch contentType={s.contentType} key={s.id} />
        ) : (
          <CustomSectionUI key={s.id} />
        )
      )}
    </div>
  );
};

const AutoSectionSwitch = ({
  contentType,
}: {
  contentType: LandingSectionAuto["contentType"];
}) => {
  if (contentType === "article") {
    return <AutoArticleSection />;
  }

  throw new Error("content type not handled");
};

const AutoArticleSection = () => {
  return <AutoArticleSectionUI articlesSwiper={<ArticlesSwiper />} />;
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
          tw`pl-xl pt-sm pb-xs text-blue-dark-content text-2xl border-b border-gray-content-border`,
        ]}
      >
        From Articles
      </h3>
      <div css={[tw`ml-lg border-l border-gray-content-border z-10`]}>
        {articlesSwiper}
      </div>
    </div>
  );
};

const ArticlesSwiper = () => {
  const articles = useSelector(selectAllArticles);

  return (
    <LandingSwiper
      elements={articles.map((article) => (
        <SwiperArticle article={article} key={article.id} />
      ))}
    />
  );
};

// todo: handle: incomplete, draft.
const SwiperArticle = ({ article }: { article: Article }) => {
  const { activeLanguageId } = useActiveLanguageContext();
  const { translations, authorIds, publishInfo } = article;

  const authors = useSelector((state) => selectAuthorsByIds(state, authorIds));

  const translationForActiveLanguage = translations.find(
    (t) => t.languageId === activeLanguageId
  );
  const translationForDefault = translations.find(
    (t) => t.languageId === default_language_Id
  );
  const translationForSecondDefault = translations.find(
    (t) => t.languageId === second_default_language_Id
  );

  const translationToUse = translationForActiveLanguage
    ? translationForActiveLanguage
    : translationForDefault
    ? translationForDefault
    : translationForSecondDefault
    ? translationForSecondDefault
    : translations[0];

  const { title, languageId: translationLanguageId } = translationToUse;

  return (
    <SwiperArticleUI
      publishDate={<PublishDate date={publishInfo.date} />}
      title={<TitleUI title={title} />}
      authors={
        authors.length ? (
          <Authors
            authors={authors}
            translationLanguageId={translationLanguageId}
          />
        ) : undefined
      }
      short={<Summary translation={translationToUse} />}
    />
  );
};

const SwiperArticleUI = ({
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
    <div css={[tw`p-sm border-r border-gray-content-border`]}>
      <p>{publishDate}</p>
      {title}
      {authors ? <h3>{authors}</h3> : null}
      <p>{short}</p>
    </div>
  );
};

const PublishDate = ({ date }: { date: Date | undefined }) => {
  const dateStr = date ? formatDateDMYStr(date) : null;

  return <PublishDateUI date={dateStr} />;
};

const PublishDateUI = ({ date }: { date: string | null }) =>
  date ? (
    <p>date</p>
  ) : (
    <div css={[tw`flex items-center gap-sm`]}>
      <span css={[tw`text-gray-placeholder`]}>date...</span>
      <MissingText tooltipText="missing publish date" />
    </div>
  );

const TitleUI = ({ title }: { title: string | undefined }) => {
  return title ? (
    <h3>{title}</h3>
  ) : (
    <div css={[tw`flex items-center gap-sm`]}>
      <span css={[tw`text-gray-placeholder`]}>title...</span>
      <MissingText tooltipText="missing title for language" />
    </div>
  );
};

const Authors = ({
  authors,
  translationLanguageId,
}: {
  authors: Author[];
  translationLanguageId: string;
}) => {
  const authorsForTranslation = authors.map((author) =>
    author.translations.find((t) => t.languageId === translationLanguageId)
  );

  return (
    <AuthorsUI
      authors={authorsForTranslation.map((a, i) => (
        <AuthorUI
          author={a?.name}
          isAFollowingAuthor={i < authors.length - 1}
          key={a?.id}
        />
      ))}
    />
  );
};

const AuthorsUI = ({ authors }: { authors: ReactElement[] }) => {
  return <div css={[tw`flex gap-xs`]}>{authors}</div>;
};

const AuthorUI = ({
  author,
  isAFollowingAuthor,
}: {
  author: string | undefined;
  isAFollowingAuthor: boolean;
}) =>
  author ? (
    <h4>
      <span>{author}</span>
      {isAFollowingAuthor ? ", " : null}
    </h4>
  ) : (
    <div css={[tw`flex`]}>
      <span css={[tw`text-gray-placeholder mr-sm`]}>author...</span>
      <MissingText tooltipText="missing author translation for language" />
      {isAFollowingAuthor ? (
        <span css={[tw`text-gray-placeholder`]}>,</span>
      ) : null}
    </div>
  );

const Summary = ({
  translation,
}: {
  translation: Article["translations"][number];
}) => {
  const { body, summary } = translation;

  const bodyProcessed = summary
    ? null
    : body
    ? getJSONContentFirstParagraph(body)
    : null;

  const editorContent = summary
    ? summary
    : bodyProcessed
    ? bodyProcessed
    : undefined;

  // console.log("editorContent:", editorContent);

  return (
    <SummaryUI
      editor={
        <SimpleTipTapEditor
          initialContent={editorContent}
          onUpdate={() => null}
          placeholder="summary here..."
        />
      }
      isContent={Boolean(editorContent)}
    />
  );
};

const SummaryUI = ({
  editor,
  isContent,
}: {
  editor: ReactElement;
  isContent: boolean;
}) => (
  <div css={[tw`relative`]}>
    <div>
      {editor}
    </div>
    {!isContent ? (
      <div css={[tw`absolute right-0 top-0`]}>
        <MissingText tooltipText="Missing summary text for translation" />
      </div>
    ) : null}
  </div>
);

/* const ShortUI = ({ text }: { text: JSONContent | null }) =>
  text ? (
    <div>
      <Markdown>

      {text}
      </Markdown>
      </div>
  ) : (
    <div css={[tw`flex items-center gap-sm`]}>
      <span css={[tw`text-gray-placeholder`]}>article text...</span>
      <MissingText tooltipText="missing article text for language" />
    </div>
  ); */
const CustomSectionUI = () => {
  return <div>Custom section</div>;
};
