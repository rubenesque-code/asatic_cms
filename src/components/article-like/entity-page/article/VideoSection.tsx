import { YoutubeLogo } from "phosphor-react";

import { getYoutubeEmbedUrlFromId } from "^helpers/youtube";

import TextArea from "^components/editors/TextArea";
import ContentMenu from "^components/menus/Content";
import WithAddYoutubeVideo from "^components/WithAddYoutubeVideo";

import ArticleUI from "./UI";

export const Video = ({ youtubeId }: { youtubeId: string }) => {
  const url = getYoutubeEmbedUrlFromId(youtubeId!);

  return <ArticleUI.Video src={url} />;
};

export const Caption = ({
  caption,
  updateCaption,
}: {
  caption: string | undefined;
  updateCaption: (caption: string) => void;
}) => {
  return (
    <ArticleUI.ImageCaption>
      <TextArea
        injectedValue={caption}
        onBlur={updateCaption}
        placeholder="optional caption"
      />
    </ArticleUI.ImageCaption>
  );
};

export const MenuButtons = ({
  updateVideoSrc,
}: {
  updateVideoSrc: (youtubeId: string) => void;
}) => {
  return (
    <>
      <WithAddYoutubeVideo
        onAddVideo={(youtubeId) => updateVideoSrc(youtubeId)}
      >
        <ContentMenu.Button tooltipProps={{ text: "change video" }}>
          <YoutubeLogo />
        </ContentMenu.Button>
      </WithAddYoutubeVideo>
      <ContentMenu.VerticalBar />
    </>
  );
};
