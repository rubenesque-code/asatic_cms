import { NextPage } from "next";
import { ReactElement, useEffect, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import {
  Gear as GearIcon,
  TagSimple as TagSimpleIcon,
  YoutubeLogo as YoutubeLogoIcon,
  Copy as CopyIcon,
  WarningCircle as WarningCircleIcon,
  Plus,
  ArrowSquareOut as ArrowSquareOutIcon,
} from "phosphor-react";
import tw from "twin.macro";

import { Collection as CollectionKey } from "^lib/firebase/firestore/collectionKeys";

import useGetSubRouteId from "^hooks/useGetSubRouteId";
import useRecordedEventsPageTopControls from "^hooks/pages/useRecordedEventPageTopControls";

import {
  getYoutubeEmbedUrlFromId,
  getYoutubeWatchUrlFromId,
} from "^helpers/youtube";
import { mapLanguageIds } from "^helpers/general";

import { useDeleteRecordedEventMutation } from "^redux/services/recordedEvents";

import { useSelector } from "^redux/hooks";
import { selectById as selectRecordedEventId } from "^redux/state/recordedEvents";
import { selectAuthorById as selectAuthorById } from "^redux/state/authors";
import { selectById as selectLanguageById } from "^redux/state/languages";

import {
  RecordedEventProvider,
  useRecordedEventContext,
} from "^context/recorded-events/RecordedEventContext";
import {
  RecordedEventTranslationProvider,
  useRecordedEventTranslationContext,
} from "^context/recorded-events/RecordedEventTranslationContext";
import {
  SelectLanguageProvider,
  useSelectLanguageContext,
} from "^context/SelectLanguageContext";
import {
  AuthorProvider,
  useAuthorContext,
} from "^context/authors/AuthorContext";

import PublishPopoverInitial from "^components/header/PublishPopover";
import WithTranslations from "^components/WithTranslations";
import WithTooltip from "^components/WithTooltip";
import WithDocSubjects from "^components/WithSubjects";
import HeaderIconButton from "^components/header/IconButton";
import MissingTranslation from "^components/MissingTranslation";
import WithCollections from "^components/WithCollections";
import WithTags from "^components/WithTags";
import WithProximityPopover from "^components/WithProximityPopover";
import InlineTextEditor from "^components/editors/Inline";
import WithDocAuthors from "^components/WithEditDocAuthors";
import WithAddYoutubeVideo from "^components/WithAddYoutubeVideo";
import MeasureWidth from "^components/MeasureWidth";
import ArticleEditor from "^components/editors/tiptap/ArticleEditor";
import DivHover from "^components/DivHover";
import HeaderUI from "^components/primary-content-item-page/header/HeaderUI";
import TranslationsPopoverLabelUI from "^components/primary-content-item-page/header/TranslationsPopoverLabelUI";
import SubjectsPopoverButtonUI from "^components/primary-content-item-page/header/SubjectsPopoverButtonUI";
import CollectionsPopoverButtonUI from "^components/primary-content-item-page/header/CollectionsPopoverButtonUI";
import AuthorsPopoverButtonUI from "^components/primary-content-item-page/header/AuthorsPopoverButtonUI";
import SettingsPanelUI from "^components/primary-content-item-page/header/SettingsPanelUI";
import MainCanvas from "^components/primary-content-item-page/MainCanvas";
import HandleRouteValidity from "^components/primary-content-item-page/HandleRouteValidity";
import Head from "^components/Head";
import QueryDatabase from "^components/QueryDatabase";

import s_transition from "^styles/transition";
import ContentMenu from "^components/menus/Content";

// todo: pages for subjects and collections

// todo: e.g. article errors not complete. Doesn't mention missing translations bodies.

// todo: title for 'recorded events' as it will be displayed on site. Using 'Asatic interviews and talks' for now.
// todo: - will need translations for above; part of a constants type

const RecordedEventPage: NextPage = () => {
  return (
    <>
      <Head />
      <QueryDatabase
        collections={[
          CollectionKey.AUTHORS,
          CollectionKey.COLLECTIONS,
          CollectionKey.LANGUAGES,
          CollectionKey.RECORDEDEVENTS,
          CollectionKey.SUBJECTS,
          CollectionKey.TAGS,
        ]}
      >
        <HandleRouteValidity docType="recordedEvent">
          <PageContent />
        </HandleRouteValidity>
      </QueryDatabase>
    </>
  );
};

export default RecordedEventPage;

const PageContent = () => {
  const recordedEventId = useGetSubRouteId();
  const recordedEvent = useSelector((state) =>
    selectRecordedEventId(state, recordedEventId)
  )!;
  const { translations } = recordedEvent;

  const languagesById = mapLanguageIds(translations);

  return (
    <div css={[tw`h-screen overflow-hidden flex flex-col`]}>
      <RecordedEventProvider recordedEvent={recordedEvent}>
        <SelectLanguageProvider languagesById={languagesById}>
          {({ activeLanguageId }) => (
            <RecordedEventTranslationProvider
              recordedEventId={recordedEventId}
              translation={
                translations.find((t) => t.languageId === activeLanguageId)!
              }
            >
              <>
                <Header />
                <Main />
              </>
            </RecordedEventTranslationProvider>
          )}
        </SelectLanguageProvider>
      </RecordedEventProvider>
    </div>
  );
};

const Header = () => {
  const { handleSave, handleUndo, isChange, saveMutationData } =
    useRecordedEventsPageTopControls();

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
  const [{ publishInfo }, { togglePublishStatus }] = useRecordedEventContext();

  return (
    <PublishPopoverInitial
      isPublished={publishInfo.status === "published"}
      toggleStatus={togglePublishStatus}
    />
  );
};

const TranslationsPopover = () => {
  const [{ translations }, { addTranslation, deleteTranslation }] =
    useRecordedEventContext();
  const [, { setActiveLanguageId }] = useSelectLanguageContext();
  const [{ id: activeTranslationId }] = useRecordedEventTranslationContext();

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
    useRecordedEventContext();

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
  ] = useRecordedEventContext();
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
  const [{ tagIds }, { removeTag, addTag }] = useRecordedEventContext();

  return (
    <WithTags
      docTagsById={tagIds}
      docType="recorded event"
      onRemoveFromDoc={(tagId) => removeTag({ tagId })}
      onAddToDoc={(tagId) => addTag({ tagId })}
    >
      <HeaderIconButton tooltip="tags">
        <TagSimpleIcon />
      </HeaderIconButton>
    </WithTags>
  );
};

const AuthorsPopover = () => {
  const [{ authorIds, languagesById }, { addAuthor, removeAuthor }] =
    useRecordedEventContext();

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
      <HeaderIconButton tooltip="settings">
        <GearIcon />
      </HeaderIconButton>
    </WithProximityPopover>
  );
};

const SettingsPanel = () => {
  const [deleteRecordedEventFromDb] = useDeleteRecordedEventMutation();
  const [{ id }] = useRecordedEventContext();

  return (
    <SettingsPanelUI
      deleteFunc={() => deleteRecordedEventFromDb({ id, useToasts: true })}
      docType="recorded event"
    />
  );
};

const Main = () => (
  <MainCanvas>
    <RecordedEventUI />
  </MainCanvas>
);

const RecordedEventUI = () => (
  <article css={[tw`h-full flex flex-col`]}>
    <header css={[tw`flex flex-col items-start gap-sm pt-lg pb-md`]}>
      <RecordedEventsTitle />
      <Title />
      <HandleIsAuthor />
    </header>
    <div css={[tw`py-lg border-t border-b border-gray-200`]}>
      <HandleIsVideo />
    </div>
    <div css={[tw`ml-xl pt-xl pl-md border-l border-gray-200 min-h-[300px]`]}>
      <Body />
    </div>
  </article>
);

const RecordedEventsTitle = () => (
  <h2 css={[tw`uppercase text-blue-800 text-base tracking-wider`]}>
    Asatic Talks & Interviews
  </h2>
);

const Title = () => {
  const [{ title }, { updateTitle }] = useRecordedEventTranslationContext();

  return (
    <TitleUI
      title={title || ""}
      updateTitle={(title) => updateTitle({ title })}
    />
  );
};

const TitleUI = ({
  title,
  updateTitle,
}: {
  title: string;
  updateTitle: (text: string) => void;
}) => (
  <div css={[tw`text-3xl font-serif-eng font-medium`]}>
    <InlineTextEditor
      injectedValue={title || ""}
      onUpdate={updateTitle}
      placeholder="Title..."
    />
  </div>
);

const HandleIsAuthor = () => {
  const [{ authorIds }] = useRecordedEventContext();

  if (!authorIds.length) {
    return null;
  }

  return <Authors />;
};

const Authors = () => {
  const [{ authorIds }] = useRecordedEventContext();

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
        <WarningCircleIcon />
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

const HandleIsVideo = () => {
  const [{ video }] = useRecordedEventContext();

  return <VideoWrapperUI>{video ? <Video /> : <NoVideoUI />}</VideoWrapperUI>;
};

const VideoWrapperUI = ({ children }: { children: ReactElement }) => (
  <div>{children}</div>
);

const NoVideoUI = () => (
  <div css={[tw`grid place-items-center aspect-ratio[16 / 9]`]}>
    <div css={[tw`grid place-items-center`]}>
      <p css={[tw`text-gray-600 font-medium`]}>No video yet</p>
      <div css={[tw`mt-md`]}>
        <WithAddYoutubeVideoPopulated>
          <button
            css={[
              tw`flex items-center gap-xs py-1 px-3 rounded-md font-medium text-white bg-yellow-400 text-sm`,
            ]}
            type="button"
          >
            <span>
              <Plus weight="bold" />
            </span>
            <span>Add Video</span>
          </button>
        </WithAddYoutubeVideoPopulated>
      </div>
    </div>
  </div>
);

const Video = () => {
  const [{ video: videoUnasserted }] = useRecordedEventContext();
  const {
    video: { id: youtubeId },
  } = videoUnasserted!;

  const url = getYoutubeEmbedUrlFromId(youtubeId);

  return <VideoUI src={url} />;
};

const VideoUI = ({ src }: { src: string }) => (
  <DivHover>
    {(isHovered) => (
      <>
        <VideoMenuUI show={isHovered} />
        <MeasureWidth>
          {(width) => (
            <iframe
              width={width}
              height={(width * 9) / 16}
              src={src}
              frameBorder="0"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </MeasureWidth>
      </>
    )}
  </DivHover>
);

const VideoMenuUI = ({ show }: { show: boolean }) => (
  <ContentMenu show={show}>
    <WithAddYoutubeVideoPopulated>
      <ContentMenu.Button tooltipProps={{ text: "change video" }}>
        <YoutubeLogoIcon />
      </ContentMenu.Button>
    </WithAddYoutubeVideoPopulated>
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

  const [{ video: videoUnasserted }] = useRecordedEventContext();
  const {
    video: { id: youtubeId },
  } = videoUnasserted!;

  const url = getYoutubeWatchUrlFromId(youtubeId);

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
  const [{ video: videoUnasserted }] = useRecordedEventContext();
  const {
    video: { id: youtubeId },
  } = videoUnasserted!;

  const url = getYoutubeWatchUrlFromId(youtubeId);

  return <VideoMenuWatchInYoutubeButtonUI url={url} />;
};

const VideoMenuWatchInYoutubeButtonUI = ({ url }: { url: string }) => (
  <a href={url} target="_blank" rel="noreferrer">
    <ContentMenu.Button tooltipProps={{ text: "watch in youtube" }}>
      <ArrowSquareOutIcon />
    </ContentMenu.Button>
  </a>
);

const WithAddYoutubeVideoPopulated = ({
  children,
}: {
  children: ReactElement;
}) => {
  const [, { updateVideoSrc }] = useRecordedEventContext();

  return (
    <WithAddYoutubeVideo
      onAddVideo={(youtubeId) => updateVideoSrc({ youtubeId })}
    >
      {children}
    </WithAddYoutubeVideo>
  );
};

const Body = () => {
  const [{ body, id: translationId }, { updateBody }] =
    useRecordedEventTranslationContext();

  return (
    <BodyWrapperUI>
      <ArticleEditor
        initialContent={body || undefined}
        onUpdate={(body) => updateBody({ body })}
        placeholder="optional video description..."
        key={translationId}
      />
    </BodyWrapperUI>
  );
};

const BodyWrapperUI = ({ children }: { children: ReactElement }) => (
  <div css={[tw``]}>{children}</div>
);
