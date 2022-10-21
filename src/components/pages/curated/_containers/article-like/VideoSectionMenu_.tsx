import ContentMenu from "^components/menus/Content";
import WithAddYoutubeVideo from "^components/WithAddYoutubeVideo";
import { YoutubeVideoIcon } from "^components/Icons";
import {
  DocumentBodySectionMenu_,
  DocumentBodySectionMenuProps,
} from "./DocumentBodySectionMenu_";

export const VideoSectionMenu_ = ({
  updateVideoSrc,
  ...menuProps
}: {
  updateVideoSrc: (youtubeId: string) => void;
} & Pick<
  DocumentBodySectionMenuProps,
  "isShowing" | "sectionIndex" | "sectionId"
>) => {
  return (
    <DocumentBodySectionMenu_ {...menuProps}>
      <WithAddYoutubeVideo onAddVideo={updateVideoSrc}>
        <ContentMenu.Button tooltipProps={{ text: "change video" }}>
          <YoutubeVideoIcon />
        </ContentMenu.Button>
      </WithAddYoutubeVideo>
      <ContentMenu.VerticalBar />
    </DocumentBodySectionMenu_>
  );
};
