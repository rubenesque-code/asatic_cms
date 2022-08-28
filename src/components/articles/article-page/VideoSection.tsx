import { YoutubeLogo } from "phosphor-react";
import { ReactElement } from "react";
import AddItemButton from "^components/buttons/AddItem";
import InlineTextEditor from "^components/editors/Inline";
import ContentMenu from "^components/menus/Content";
import WithAddYoutubeVideoUnpopulated from "^components/WithAddYoutubeVideo";
import ArticleImageSectionSlice from "^context/articles/ArticleImageSectionContext";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";
import ArticleVideoSectionSlice from "^context/articles/ArticleVideoSectionContext";
import { getYoutubeEmbedUrlFromId } from "^helpers/youtube";
import ArticleBody from "./ArticleBody";
import ArticleUI from "./ArticleUI";

const WithAddVideoPopulated = ({ children }: { children: ReactElement }) => {
  const [, { updateBodyVideoSrc }] = ArticleVideoSectionSlice.useContext();

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
      image: { imageId },
    },
  ] = ArticleImageSectionSlice.useContext();

  return imageId ? <WithVideo /> : <WithoutVideo />;
}

function WithoutVideo() {
  return (
    <ArticleUI.VideoSectionEmpty>
      <>
        <WithAddVideoPopulated>
          <AddItemButton>Add Video</AddItemButton>
        </WithAddVideoPopulated>
        <WithoutVideo.Menu />
      </>
    </ArticleUI.VideoSectionEmpty>
  );
}

WithoutVideo.Menu = function WithoutVideoMenu() {
  const [, { removeBodySection }] = ArticleTranslationSlice.useContext();
  const [{ sectionHoveredIndex }] = ArticleBody.useContext();
  const [{ id: sectionId, index }] = ArticleVideoSectionSlice.useContext();

  return (
    <ArticleUI.SectionMenu
      deleteSection={() => removeBodySection({ sectionId })}
      show={index === sectionHoveredIndex}
    />
  );
};

function WithVideo() {
  return (
    <ArticleUI.VideoSection>
      <Video />
      <Caption />
      <WithVideo.Menu />
    </ArticleUI.VideoSection>
  );
}

const Video = () => {
  const [
    {
      video: { youtubeId },
    },
  ] = ArticleVideoSectionSlice.useContext();

  const url = getYoutubeEmbedUrlFromId(youtubeId!);

  return <ArticleUI.Video src={url} />;
};

const Caption = () => {
  const [
    {
      video: { caption },
    },
    { updateBodyVideoCaption },
  ] = ArticleVideoSectionSlice.useContext();

  return (
    <ArticleUI.ImageCaption>
      <InlineTextEditor
        injectedValue={caption}
        onUpdate={(caption) => updateBodyVideoCaption({ caption })}
        placeholder="optional caption"
      />
    </ArticleUI.ImageCaption>
  );
};

WithVideo.Menu = function WithVideoMenu() {
  const [, { removeBodySection }] = ArticleTranslationSlice.useContext();
  const [{ sectionHoveredIndex }] = ArticleBody.useContext();
  const [{ id: sectionId, index }] = ArticleVideoSectionSlice.useContext();

  return (
    <ArticleUI.SectionMenu
      deleteSection={() => removeBodySection({ sectionId })}
      show={index === sectionHoveredIndex}
    >
      <WithAddVideoPopulated>
        <ContentMenu.Button tooltipProps={{ text: "change image" }}>
          <YoutubeLogo />
        </ContentMenu.Button>
      </WithAddVideoPopulated>
      <ContentMenu.VerticalBar />
    </ArticleUI.SectionMenu>
  );
};
