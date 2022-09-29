import { Plus, YoutubeLogo } from "phosphor-react";
import { ReactElement } from "react";
import tw from "twin.macro";

import InlineTextEditor from "^components/editors/Inline";
import ContentMenu from "^components/menus/Content";
import WithAddYoutubeVideoUnpopulated from "^components/WithAddYoutubeVideo";
import ArticleVideoSectionSlice from "^context/articles/ArticleVideoSectionContext";
import { getYoutubeEmbedUrlFromId } from "^helpers/youtube";
import ArticleBody, { SectionMenu } from "./ArticleBody";
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
      video: { youtubeId },
    },
  ] = ArticleVideoSectionSlice.useContext();

  return youtubeId ? <WithVideo /> : <WithoutVideo />;
}

function WithoutVideo() {
  return (
    <ArticleUI.SectionEmpty title="Video section">
      <>
        <WithAddVideoPopulated>
          <div css={[tw`flex items-center gap-xs cursor-pointer`]}>
            <div css={[tw`relative text-gray-300`]}>
              <span css={[tw`text-3xl`]}>
                <YoutubeLogo />
              </span>
              <span css={[tw`absolute -bottom-0.5 -right-1 bg-white`]}>
                <Plus />
              </span>
            </div>
            <p css={[tw`text-gray-600`]}>Add video</p>
          </div>
        </WithAddVideoPopulated>
        <WithoutVideo.Menu />
      </>
    </ArticleUI.SectionEmpty>
  );
}

WithoutVideo.Menu = function WithoutVideoMenu() {
  // const [{ sectionHoveredIndex }] = ArticleBody.useContext();
  const [{ id: sectionId, index }] = ArticleVideoSectionSlice.useContext();

  return (
    <SectionMenu isShowing={true} sectionId={sectionId} sectionIndex={index} />
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
  // const [{ sectionHoveredIndex }] = ArticleBody.useContext();
  const [{ id: sectionId, index }] = ArticleVideoSectionSlice.useContext();

  return (
    <SectionMenu isShowing={true} sectionId={sectionId} sectionIndex={index}>
      <>
        <WithAddVideoPopulated>
          <ContentMenu.Button tooltipProps={{ text: "change video" }}>
            <YoutubeLogo />
          </ContentMenu.Button>
        </WithAddVideoPopulated>
        <ContentMenu.VerticalBar />
      </>
    </SectionMenu>
  );
};
