import { ReactElement } from "react";
import {
  Article as ArticleIcon,
  Image as ImageIcon,
  YoutubeLogo,
} from "phosphor-react";

import Popover from "^components/ProximityPopover";
import ContentMenu from "^components/menus/Content";

export type Props = PanelProps;

function AddSectionPopover({
  children: button,
  ...panelProps
}: { children: ReactElement } & PanelProps) {
  return (
    <Popover>
      {({ isOpen }) => (
        <>
          <Popover.Panel isOpen={isOpen}>
            <AddSectionPanel {...panelProps} />
          </Popover.Panel>
          <Popover.Button>{button}</Popover.Button>
        </>
      )}
    </Popover>
  );
}

export default AddSectionPopover;

type PanelProps = {
  addTextSection: () => void;
  addImageSection: () => void;
  addVideoSection: () => void;
};

const AddSectionPanel = ({
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
      <YoutubeLogo />
    </ContentMenu.Button>
  </ContentMenu>
);
