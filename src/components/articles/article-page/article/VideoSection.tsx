import { YoutubeLogo } from "phosphor-react";

import ArticleVideoSectionSlice from "^context/articles/ArticleVideoSectionContext";

import WithAddYoutubeVideo from "^components/WithAddYoutubeVideo";

import ArticleUI from "^components/article-like/entity-page/article/UI";

import SectionMenuGeneric from "./SectionMenuGeneric";

import {
  Video as VideoUnpopulated,
  Caption as CaptionUnpopulated,
  MenuButtons,
} from "^components/article-like/entity-page/article/VideoSection";

export default function VideoSection() {
  const [
    {
      video: { youtubeId },
    },
  ] = ArticleVideoSectionSlice.useContext();

  return youtubeId ? <WithVideo /> : <WithoutVideo />;
}

function WithoutVideo() {
  const [{ id: sectionId, index }, { updateBodyVideoSrc }] =
    ArticleVideoSectionSlice.useContext();

  return (
    <ArticleUI.SectionEmpty title="Video section">
      {(isHovered) => (
        <>
          <WithAddYoutubeVideo
            onAddVideo={(youtubeId) => updateBodyVideoSrc({ youtubeId })}
          >
            <ArticleUI.SectionEmptyButton text="Add video">
              <YoutubeLogo />
            </ArticleUI.SectionEmptyButton>
          </WithAddYoutubeVideo>
          <SectionMenuGeneric
            isShowing={isHovered}
            sectionId={sectionId}
            sectionIndex={index}
          />
        </>
      )}
    </ArticleUI.SectionEmpty>
  );
}

function WithVideo() {
  return (
    <ArticleUI.MediaSection>
      {(isHovered) => (
        <>
          <Video />
          <Caption />
          <WithVideoMenu isShowing={isHovered} />
        </>
      )}
    </ArticleUI.MediaSection>
  );
}

const Video = () => {
  const [
    {
      video: { youtubeId },
    },
  ] = ArticleVideoSectionSlice.useContext();

  return <VideoUnpopulated youtubeId={youtubeId!} />;
};

const Caption = () => {
  const [
    {
      video: { caption },
    },
    { updateBodyVideoCaption },
  ] = ArticleVideoSectionSlice.useContext();

  return (
    <CaptionUnpopulated
      caption={caption}
      updateCaption={(caption) => updateBodyVideoCaption({ caption })}
    />
  );
};

function WithVideoMenu({ isShowing }: { isShowing: boolean }) {
  const [{ id: sectionId, index }, { updateBodyVideoSrc }] =
    ArticleVideoSectionSlice.useContext();

  return (
    <SectionMenuGeneric
      isShowing={isShowing}
      sectionId={sectionId}
      sectionIndex={index}
    >
      <>
        <MenuButtons
          updateVideoSrc={(youtubeId) => updateBodyVideoSrc({ youtubeId })}
        />
      </>
    </SectionMenuGeneric>
  );
}
