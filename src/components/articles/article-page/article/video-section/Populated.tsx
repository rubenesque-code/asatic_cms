/* eslint-disable jsx-a11y/alt-text */
import ArticleVideoSectionSlice from "^context/articles/ArticleVideoSectionContext";

import VideoSection from "^components/display-entity/entity-page/article/VideoSection";
import MediaSection from "^components/display-entity/entity-page/article/MediaSection";

import SectionMenuGeneric from "../SectionMenuGeneric";
import ContentMenu from "^components/menus/Content";

export default function Populated() {
  return (
    <MediaSection>
      {(isHovered) => (
        <>
          <Video />
          <Caption />
          <Menu isShowing={isHovered} />
        </>
      )}
    </MediaSection>
  );
}

const Video = () => {
  const [
    {
      video: { youtubeId },
    },
  ] = ArticleVideoSectionSlice.useContext();

  return <VideoSection.Video youtubeId={youtubeId!} />;
};

const Caption = () => {
  const [
    {
      video: { caption },
    },
    { updateBodyVideoCaption },
  ] = ArticleVideoSectionSlice.useContext();

  return (
    <MediaSection.Caption
      caption={caption}
      updateCaption={(caption) => updateBodyVideoCaption({ caption })}
    />
  );
};

function Menu({ isShowing }: { isShowing: boolean }) {
  const [{ id: sectionId, index: sectionIndex }, { updateBodyVideoSrc }] =
    ArticleVideoSectionSlice.useContext();

  return (
    <SectionMenuGeneric
      isShowing={isShowing}
      sectionId={sectionId}
      sectionIndex={sectionIndex}
    >
      <>
        <VideoSection.MenuButtons
          updateVideoSrc={(youtubeId) => updateBodyVideoSrc({ youtubeId })}
        />
        <ContentMenu.VerticalBar />
      </>
    </SectionMenuGeneric>
  );
}
