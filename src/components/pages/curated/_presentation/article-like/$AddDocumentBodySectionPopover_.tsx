import { ReactElement } from "react";

import Popover from "^components/ProximityPopover";
import ContentMenu from "^components/menus/Content";
import { ArticleIcon, ImageIcon, YoutubeVideoIcon } from "^components/Icons";

export type Props = PanelProps;

export function $AddDocumentBodySectionPopover_({
  children: button,
  ...panelProps
}: { children: ReactElement } & PanelProps) {
  return (
    <Popover>
      <>
        <Popover.Panel>
          <Panel {...panelProps} />
        </Popover.Panel>
        <Popover.Button>{button}</Popover.Button>
      </>
    </Popover>
  );
}

type PanelProps = {
  addTextSection: () => void;
  addImageSection: () => void;
  addVideoSection: () => void;
};

const Panel = ({
  addImageSection,
  addTextSection,
  addVideoSection,
}: PanelProps) => (
  <ContentMenu show={true}>
    <ContentMenu.Button
      onClick={addTextSection}
      tooltipProps={{ text: "text section" }}
    >
      <ArticleIcon />
    </ContentMenu.Button>
    <ContentMenu.Button
      onClick={addImageSection}
      tooltipProps={{ text: "image section" }}
    >
      <ImageIcon />
    </ContentMenu.Button>
    <ContentMenu.Button
      onClick={addVideoSection}
      tooltipProps={{ text: "video section" }}
    >
      <YoutubeVideoIcon />
    </ContentMenu.Button>
  </ContentMenu>
);
