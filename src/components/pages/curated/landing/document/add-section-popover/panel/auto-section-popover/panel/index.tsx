import { ReactElement } from "react";

import { useDispatch, useSelector } from "^redux/hooks";
import {
  addOne as addLandingSection,
  selectAll as selectLandingSections,
} from "^redux/state/landing";

import { useComponentContext } from "../../../Context";

import { AutoSection } from "^types/landing";

import ContentMenu from "^components/menus/Content";
import {
  // ArticleIcon,
  // BlogIcon,
  CollectionIcon,
  RecordedEventIcon,
} from "^components/Icons";

const Panel = () => {
  const { closePopover, newSectionIndex } = useComponentContext();

  const autoLandingSections = useSelector(selectLandingSections)
    .flatMap((s) => (s.type === "auto" ? [s] : []))
    .map((s) => s.contentType);

  const dispatch = useDispatch();
  const addAutoSection = (contentType: AutoSection["contentType"]) => {
    dispatch(
      addLandingSection({ type: "auto", index: newSectionIndex, contentType })
    );
    closePopover();
  };

  return (
    <ContentMenu show={true}>
      {/*       <AutoSectionPanelButton
        docType="article"
        isUsed={autoLandingSections.includes("article")}
        onClick={() => addAutoSection("article")}
      >
        <ArticleIcon />
      </AutoSectionPanelButton> */}
      {/*       <AutoSectionPanelButton
        docType="blog"
        isUsed={autoLandingSections.includes("blog")}
        onClick={() => addAutoSection("blog")}
      >
        <BlogIcon />
      </AutoSectionPanelButton> */}
      <AutoSectionPanelButton
        docType="collection"
        isUsed={autoLandingSections.includes("collection")}
        onClick={() => addAutoSection("collection")}
      >
        <CollectionIcon />
      </AutoSectionPanelButton>
      <AutoSectionPanelButton
        docType="recorded-event"
        isUsed={autoLandingSections.includes("recordedEvent")}
        onClick={() => addAutoSection("recordedEvent")}
      >
        <RecordedEventIcon />
      </AutoSectionPanelButton>
    </ContentMenu>
  );
};

export default Panel;

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
