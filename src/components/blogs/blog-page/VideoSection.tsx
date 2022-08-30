import { YoutubeLogo } from "phosphor-react";
import { ReactElement } from "react";

import AddItemButton from "^components/buttons/AddItem";
import InlineTextEditor from "^components/editors/Inline";
import ContentMenu from "^components/menus/Content";
import WithAddYoutubeVideoUnpopulated from "^components/WithAddYoutubeVideo";
import BlogTranslationSlice from "^context/blogs/BlogTranslationContext";
import BlogVideoSectionSlice from "^context/blogs/BlogVideoSectionContext";
import { getYoutubeEmbedUrlFromId } from "^helpers/youtube";
import Body from "./Body";
import BlogUI from "./BlogUI";

const WithAddVideoPopulated = ({ children }: { children: ReactElement }) => {
  const [, { updateBodyVideoSrc }] = BlogVideoSectionSlice.useContext();

  return (
    <WithAddYoutubeVideoUnpopulated
      onAddVideo={(youtubeId) => updateBodyVideoSrc({ youtubeId })}
    >
      {children}
    </WithAddYoutubeVideoUnpopulated>
  );
};

export default function VideoSection() {
  const [
    {
      video: { youtubeId },
    },
  ] = BlogVideoSectionSlice.useContext();

  return youtubeId ? <WithVideo /> : <WithoutVideo />;
}

function WithoutVideo() {
  return (
    <BlogUI.VideoSectionEmpty>
      <>
        <WithAddVideoPopulated>
          <AddItemButton>Add Video</AddItemButton>
        </WithAddVideoPopulated>
        <WithoutVideo.Menu />
      </>
    </BlogUI.VideoSectionEmpty>
  );
}

WithoutVideo.Menu = function WithoutVideoMenu() {
  const [, { removeBodySection }] = BlogTranslationSlice.useContext();
  const [{ sectionHoveredIndex }] = Body.useContext();
  const [{ id: sectionId, index }] = BlogVideoSectionSlice.useContext();

  return (
    <BlogUI.SectionMenu
      deleteSection={() => removeBodySection({ sectionId })}
      show={index === sectionHoveredIndex}
    />
  );
};

function WithVideo() {
  return (
    <BlogUI.VideoSection>
      <Video />
      <Caption />
      <WithVideo.Menu />
    </BlogUI.VideoSection>
  );
}

const Video = () => {
  const [
    {
      video: { youtubeId },
    },
  ] = BlogVideoSectionSlice.useContext();

  const url = getYoutubeEmbedUrlFromId(youtubeId!);

  return <BlogUI.Video src={url} />;
};

const Caption = () => {
  const [
    {
      video: { caption },
    },
    { updateBodyVideoCaption },
  ] = BlogVideoSectionSlice.useContext();

  return (
    <BlogUI.ImageCaption>
      <InlineTextEditor
        injectedValue={caption}
        onUpdate={(caption) => updateBodyVideoCaption({ caption })}
        placeholder="optional caption"
      />
    </BlogUI.ImageCaption>
  );
};

WithVideo.Menu = function WithVideoMenu() {
  const [, { removeBodySection }] = BlogTranslationSlice.useContext();
  const [{ sectionHoveredIndex }] = Body.useContext();
  const [{ id: sectionId, index }] = BlogVideoSectionSlice.useContext();

  return (
    <BlogUI.SectionMenu
      deleteSection={() => removeBodySection({ sectionId })}
      show={index === sectionHoveredIndex}
    >
      <WithAddVideoPopulated>
        <ContentMenu.Button tooltipProps={{ text: "change video" }}>
          <YoutubeLogo />
        </ContentMenu.Button>
      </WithAddVideoPopulated>
      <ContentMenu.VerticalBar />
    </BlogUI.SectionMenu>
  );
};
