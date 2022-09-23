import { ReactElement } from "react";
import {
  Article as ArticleIcon,
  CirclesFour,
  Notepad,
  Robot,
  User,
  VideoCamera,
} from "phosphor-react";

import { useDispatch, useSelector } from "^redux/hooks";
import {
  addOne as addLandingSection,
  selectAll as selectLandingSections,
} from "^redux/state/landing";

import { LandingSectionAuto } from "^types/landing";

import ContentMenu from "^components/menus/Content";
import Popover from "^components/ProximityPopover";

function Panel({ newSectionIndex }: { newSectionIndex: number }) {
  return (
    <ContentMenu show={true}>
      <CustomSectionButton newSectionIndex={newSectionIndex} />
      <AutoSectionPopover newSectionIndex={newSectionIndex} />
    </ContentMenu>
  );
}

export default Panel;

const CustomSectionButton = ({
  newSectionIndex,
}: {
  newSectionIndex: number;
}) => {
  const dispatch = useDispatch();

  const addUserCreatedSection = () =>
    dispatch(addLandingSection({ type: "custom", index: newSectionIndex }));

  return (
    <ContentMenu.Button
      onClick={addUserCreatedSection}
      tooltipProps={{
        text: {
          header: "user-created",
          body: "Add any type of document and edit its size.",
        },
        type: "action",
      }}
    >
      <User />
    </ContentMenu.Button>
  );
};

const AutoSectionPopover = ({
  newSectionIndex,
}: {
  newSectionIndex: number;
}) => {
  return (
    <Popover>
      {({ isOpen }) => (
        <>
          <Popover.Panel isOpen={isOpen}>
            <AutoSectionPanel newSectionIndex={newSectionIndex} />
          </Popover.Panel>
          <Popover.Button>
            <ContentMenu.Button
              tooltipProps={{
                text: {
                  header: "auto-created",
                  body: "Choose from document types, e.g. articles, and a swipeable section will be created.",
                },
                placement: "top",
              }}
            >
              <Robot />
            </ContentMenu.Button>
          </Popover.Button>
        </>
      )}
    </Popover>
  );
};

const AutoSectionPanel = ({ newSectionIndex }: { newSectionIndex: number }) => {
  const autoLandingSections = useSelector(selectLandingSections)
    .flatMap((s) => (s.type === "auto" ? [s] : []))
    .map((s) => s.contentType);

  const dispatch = useDispatch();
  const addAutoSection = (contentType: LandingSectionAuto["contentType"]) =>
    dispatch(
      addLandingSection({ type: "auto", index: newSectionIndex, contentType })
    );

  return (
    <ContentMenu show={true}>
      <AutoSectionPanelButton
        docType="article"
        isUsed={autoLandingSections.includes("article")}
        onClick={() => addAutoSection("article")}
      >
        <ArticleIcon />
      </AutoSectionPanelButton>
      <AutoSectionPanelButton
        docType="blog"
        isUsed={autoLandingSections.includes("blog")}
        onClick={() => addAutoSection("blog")}
      >
        <Notepad />
      </AutoSectionPanelButton>
      <AutoSectionPanelButton
        docType="collection"
        isUsed={autoLandingSections.includes("collection")}
        onClick={() => addAutoSection("collection")}
      >
        <CirclesFour />
      </AutoSectionPanelButton>
      <AutoSectionPanelButton
        docType="recorded-event"
        isUsed={autoLandingSections.includes("recorded-event")}
        onClick={() => addAutoSection("recorded-event")}
      >
        <VideoCamera />
      </AutoSectionPanelButton>
    </ContentMenu>
  );
};

const AutoSectionPanelButton = ({
  children,
  docType,
  isUsed,
  onClick,
}: {
  children: ReactElement;
  docType: "article" | "blog" | "collection" | "recorded-event";
  isUsed: boolean;
  onClick: () => void;
}) => {
  return (
    <ContentMenu.Button
      isDisabled={isUsed}
      onClick={onClick}
      tooltipProps={{ text: isUsed ? "already used" : docType, type: "action" }}
    >
      {children}
    </ContentMenu.Button>
  );
};
