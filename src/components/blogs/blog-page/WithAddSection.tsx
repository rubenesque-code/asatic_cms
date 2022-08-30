import { nanoid } from "@reduxjs/toolkit";
import {
  Article as ArticleIcon,
  Image as ImageIcon,
  YoutubeLogo,
} from "phosphor-react";
import { ReactElement } from "react";
import ContentMenu from "^components/menus/Content";
import WithProximityPopover from "^components/WithProximityPopover";
import BlogTranslationSlice from "^context/blogs/BlogTranslationContext";
import {
  createArticleLikeImageSection,
  createArticleLikeTextSection,
  createArticleLikeVideoSection,
} from "^data/createDocument";

const WithAddSection = ({
  children,
  sectionToAddIndex,
}: {
  sectionToAddIndex: number;
  children: ReactElement;
}) => {
  const [, { addBodySection }] = BlogTranslationSlice.useContext();

  const addImage = () =>
    addBodySection({
      sectionData: createArticleLikeImageSection({
        id: nanoid(),
        index: sectionToAddIndex,
      }),
    });
  const addText = () =>
    addBodySection({
      sectionData: createArticleLikeTextSection({
        id: nanoid(),
        index: sectionToAddIndex,
      }),
    });
  const addVideo = () =>
    addBodySection({
      sectionData: createArticleLikeVideoSection({
        id: nanoid(),
        index: sectionToAddIndex,
      }),
    });

  return (
    <WithProximityPopover
      panel={({ close: closePanel }) => (
        <AddSectionPanelUI
          addImage={() => {
            addImage();
            closePanel();
          }}
          addText={() => {
            addText();
            closePanel();
          }}
          addVideo={() => {
            addVideo();
            closePanel();
          }}
        />
      )}
      placement="top"
    >
      {children}
    </WithProximityPopover>
  );
};

export default WithAddSection;

const AddSectionPanelUI = ({
  addImage,
  addText,
  addVideo,
}: {
  addText: () => void;
  addImage: () => void;
  addVideo: () => void;
}) => (
  <ContentMenu show={true}>
    <ContentMenu.Button
      onClick={addText}
      tooltipProps={{ text: "text section" }}
    >
      <ArticleIcon />
    </ContentMenu.Button>
    <ContentMenu.Button
      onClick={addImage}
      tooltipProps={{ text: "image section" }}
    >
      <ImageIcon />
    </ContentMenu.Button>
    <ContentMenu.Button
      onClick={addVideo}
      tooltipProps={{ text: "video section" }}
    >
      <YoutubeLogo />
    </ContentMenu.Button>
  </ContentMenu>
);
