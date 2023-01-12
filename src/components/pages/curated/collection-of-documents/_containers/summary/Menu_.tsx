import { ReactElement } from "react";
import tw from "twin.macro";
// import { toast } from "react-toastify";

import ContentMenu from "^components/menus/Content";
import {
  GoToPageIcon,
  // NarrowIcon,
  // RemoveRelatedEntityIcon,
  TurnOnIcon,
  // WidenIcon,
} from "^components/Icons";

export type ArticleLikeMenu_Props = {
  isShowing: boolean;
  routeToEntityPage: () => void;
  toggleUseImageOn: () => void;
  usingImage: boolean;
  children: ReactElement;
};

export const ArticleLikeMenu_ = ({
  isShowing,
  routeToEntityPage,
  usingImage,
  toggleUseImageOn,
  children,
}: ArticleLikeMenu_Props) => {
  return (
    <ContentMenu show={isShowing} styles={tw`absolute left-0 top-sm`}>
      <ContentMenu.Button
        onClick={routeToEntityPage}
        tooltipProps={{ text: "go to article page" }}
      >
        <GoToPageIcon />
      </ContentMenu.Button>
      <ContentMenu.VerticalBar />
      {!usingImage ? (
        <>
          <ContentMenu.Button
            onClick={toggleUseImageOn}
            tooltipProps={{ text: "use image" }}
          >
            <TurnOnIcon />
          </ContentMenu.Button>
          <ContentMenu.VerticalBar />
        </>
      ) : null}
      {children}
    </ContentMenu>
  );
};

/* const ArticleLikeMenuOLd = ({
  routeToEntityPage,
  isShowing,
  usingImage,
  toggleUseImageOn,
  ignoreDeclaredSpan,
  removeComponent,
  updateComponentSpan,
  span,
}: ArticleLikeMenu_Props) => {
  const canNarrow = !ignoreDeclaredSpan && span === 2;
  const canWiden = !ignoreDeclaredSpan && span === 1;

  return (
    <ContentMenu show={isShowing} styles={tw`absolute left-0 top-sm`}>
      <ContentMenu.ButtonWithWarning
        tooltipProps={{ text: "remove component", type: "action" }}
        warningProps={{
          callbackToConfirm: () => {
            removeComponent();
            toast.success("removed");
          },
          warningText: "Remove component?",
        }}
      >
        <RemoveRelatedEntityIcon />
      </ContentMenu.ButtonWithWarning>
      <ContentMenu.VerticalBar />
      <ContentMenu.Button
        onClick={routeToEntityPage}
        tooltipProps={{ text: "go to article page" }}
      >
        <GoToPageIcon />
      </ContentMenu.Button>
      <ContentMenu.VerticalBar />
      <ContentMenu.Button
        isDisabled={!canWiden}
        onClick={() => canWiden && updateComponentSpan(2)}
        tooltipProps={{
          text: "widen",
          type: "action",
        }}
      >
        <WidenIcon />
      </ContentMenu.Button>
      <ContentMenu.Button
        isDisabled={!canNarrow}
        onClick={() => canNarrow && updateComponentSpan(1)}
        tooltipProps={{
          text: "narrow",
          type: "action",
        }}
      >
        <NarrowIcon />
      </ContentMenu.Button>
      {!usingImage ? (
        <>
          <ContentMenu.VerticalBar />
          <ContentMenu.Button
            onClick={toggleUseImageOn}
            tooltipProps={{ text: "use image" }}
          >
            <TurnOnIcon />
          </ContentMenu.Button>
        </>
      ) : (
        <></>
      )}
    </ContentMenu>
  );
};
 */
