import ContainerUtility from "^components/ContainerUtilities";
import VideoIFrame from "^components/video/IFrame";
import { getYoutubeEmbedUrlFromId } from "^helpers/youtube";

export function Video_({ youtubeId }: { youtubeId: string }) {
  const url = getYoutubeEmbedUrlFromId(youtubeId!);

  return (
    <ContainerUtility.Width>
      {(width) => (
        <VideoIFrame height={(width * 9) / 16} src={url} width={width} />
      )}
    </ContainerUtility.Width>
  );
}
