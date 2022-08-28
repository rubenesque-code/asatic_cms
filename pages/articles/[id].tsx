import type { NextPage } from "next";
import { ReactElement, useEffect, useState } from "react";
import tw from "twin.macro";
import {
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

import { useDispatch, useSelector } from "^redux/hooks";
import { selectById, updatePublishDate } from "^redux/state/articles";
import { selectById as selectAuthorById } from "^redux/state/authors";

import ArticleSlice from "^context/articles/ArticleContext";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";
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
import { mapIds, sortComponents } from "^helpers/general";

// import { Art } from "^types/article-like-content";

import Head from "^components/Head";
import QueryDatabase from "^components/QueryDatabase";
import DatePicker from "^components/date-picker";
import InlineTextEditor from "^components/editors/Inline";
import WithTooltip from "^components/WithTooltip";
import HandleRouteValidity from "^components/primary-content-item-page/HandleRouteValidity";
import WithProximityPopover from "^components/WithProximityPopover";
import EmptySectionsUI from "^components/pages/article/EmptySectionsUI";
import AddItemButton from "^components/buttons/AddItem";
import ArticleEditor from "^components/editors/tiptap/ArticleEditor";
import DndSortableContext from "^components/dndkit/DndSortableContext";
import DndSortableElement from "^components/dndkit/DndSortableElement";
import ImageMenuUI from "^components/menus/Image";
import WithAddDocImage from "^components/WithAddDocImage";
import ResizeImage from "^components/resize/Image";
import MyImage from "^components/images/MyImage";
import WithAddYoutubeVideoInitial from "^components/WithAddYoutubeVideo";
import MeasureWidth from "^components/MeasureWidth";
import DivHover from "^components/DivHover";
import MissingTranslation from "^components/MissingTranslation";
import MainCanvas from "^components/primary-content-item-page/MainCanvas";

import s_transition from "^styles/transition";
import ContentMenu from "^components/menus/Content";
import {
  createArticleLikeImageSection,
  createArticleLikeTextSection,
  createArticleLikeVideoSection,
} from "^data/createDocument";
import { nanoid } from "@reduxjs/toolkit";
import { Article as ArticleType } from "^types/article";
import DocLanguages from "^components/DocLanguages";
import HeaderUnpopulated from "^components/articles/article-page/Header";
import { useLeavePageConfirm } from "^hooks/useLeavePageConfirm";

import PageContent from "^components/articles/article-page/index";

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

const SectionMenu = ({
  sectionId,
  show,
}: {
  sectionId: string;
  show: boolean;
}) => {
  const [, { removeBodySection }] = ArticleTranslationSlice.useContext();

  const removeSection = () => removeBodySection({ sectionId });

  return <SectionMenuUI deleteSection={removeSection} show={show} />;
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
      <ContentMenu.ButtonWithWarning
        warningProps={{
          callbackToConfirm: deleteSection,
          warningText: "delete section?",
          type: "moderate",
        }}
        tooltipProps={{ text: "delete section", type: "action" }}
      >
        <TrashIcon />
      </ContentMenu.ButtonWithWarning>
    </>
  </ContentMenu>
);

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
          <MyImage
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
  const [
    {
      video: { youtubeId },
    },
  ] = useArticleVideoSectionContext();

  return youtubeId ? <VideoSectionUI /> : <VideoSectionEmptyUI />;
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
      onAddVideo={(youtubeId) => updateBodyVideoSrc({ youtubeId })}
    >
      {children}
    </WithAddYoutubeVideoInitial>
  );
};

const VideoSectionVideo = () => {
  const [{ video }] = useArticleVideoSectionContext();
  const { youtubeId } = video;

  const url = getYoutubeEmbedUrlFromId(youtubeId!);

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

  const [
    {
      video: { youtubeId },
    },
  ] = useArticleVideoSectionContext();

  const url = getYoutubeWatchUrlFromId(youtubeId!);

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
  const [
    {
      video: { youtubeId },
    },
  ] = useArticleVideoSectionContext();

  const url = getYoutubeWatchUrlFromId(youtubeId!);

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
