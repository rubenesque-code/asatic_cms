import { ReactElement } from "react";

import Popover from "^components/ProximityPopover";
import ContentMenu from "^components/menus/Content";
import {
  ArticleIcon,
  ImageIcon,
  TableIcon,
  YoutubeVideoIcon,
} from "^components/Icons";
import { MyOmit } from "^types/utilities";

export type Props = PanelProps;

export function $AddDocumentBodySectionPopover_({
  children: button,
  ...panelProps
}: { children: ReactElement } & MyOmit<PanelProps, "closePopover">) {
  return (
    <Popover>
      <>
        <Popover.Panel>
          {({ close: closePopover }) => (
            <Panel closePopover={closePopover} {...panelProps} />
          )}
        </Popover.Panel>
        <Popover.Button>{button}</Popover.Button>
      </>
    </Popover>
  );
}

type PanelProps = {
  closePopover: () => void;
  addTextSection: () => void;
  addImageSection: () => void;
  addVideoSection: () => void;
  addTableSection: () => void;
};

const Panel = ({
  closePopover,
  addImageSection,
  addTextSection,
  addVideoSection,
  addTableSection,
}: PanelProps) => {
  return (
    <ContentMenu show={true}>
      <ContentMenu.Button
        onClick={() => {
          addTextSection();
          closePopover();
        }}
        tooltipProps={{ text: "text section" }}
      >
        <ArticleIcon />
      </ContentMenu.Button>
      <ContentMenu.Button
        onClick={() => {
          addImageSection();
          closePopover();
        }}
        tooltipProps={{ text: "image section" }}
      >
        <ImageIcon />
      </ContentMenu.Button>
      <ContentMenu.Button
        onClick={() => {
          addVideoSection();
          closePopover();
        }}
        tooltipProps={{ text: "video section" }}
      >
        <YoutubeVideoIcon />
      </ContentMenu.Button>
      <ContentMenu.Button
        onClick={() => {
          addTableSection();
          closePopover();
        }}
        tooltipProps={{ text: "table section" }}
      >
        <TableIcon />
      </ContentMenu.Button>
    </ContentMenu>
  );
};
