import ContentMenu from "^components/menus/Content";
import WithAddYoutubeVideo from "^components/WithAddYoutubeVideo";
import { YoutubeVideoIcon } from "^components/Icons";

export const UpdateVideoSrcButton = ({
  updateVideoSrc,
}: {
  updateVideoSrc: (youtubeId: string) => void;
}) => {
  return (
    <>
      <WithAddYoutubeVideo onAddVideo={updateVideoSrc}>
        <ContentMenu.Button tooltipProps={{ text: "change video" }}>
          <YoutubeVideoIcon />
        </ContentMenu.Button>
      </WithAddYoutubeVideo>
      <ContentMenu.VerticalBar />
    </>
  );
};
