import { ReactElement } from "react";
import tw from "twin.macro";
import { toast } from "react-toastify";

import ContentMenu from "^components/menus/Content";
import {
  GoToPageIcon,
  NarrowIcon,
  RemoveRelatedEntityIcon,
  TurnOnIcon,
  WidenIcon,
} from "^components/Icons";

export type ArticleLikeMenu_Props = {
  isShowing: boolean;
  routeToEntityPage: () => void;
  toggleUseImageOn?: null | (() => void);
  usingImage: boolean;
  children?: ReactElement;
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
      {toggleUseImageOn && !usingImage ? (
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
      {children ? children : null}
    </ContentMenu>
  );
};

export const CustomSectionComponentMenuButtons_ = ({
  removeComponent,
  changeSpan,
}: {
  removeComponent: () => void;
  changeSpan?: {
    narrow: () => void;
    widen: () => void;
    canWiden: boolean;
    canNarrow: boolean;
  };
}) => (
  <>
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
    {changeSpan ? (
      <>
        <ContentMenu.VerticalBar />
        <ContentMenu.Button
          isDisabled={!changeSpan.canWiden}
          onClick={() => changeSpan.canWiden && changeSpan.widen()}
          tooltipProps={{
            text: "widen",
            type: "action",
          }}
        >
          <WidenIcon />
        </ContentMenu.Button>
        <ContentMenu.Button
          isDisabled={!changeSpan.canNarrow}
          onClick={() => changeSpan.canNarrow && changeSpan.narrow()}
          tooltipProps={{
            text: "narrow",
            type: "action",
          }}
        >
          <NarrowIcon />
        </ContentMenu.Button>
      </>
    ) : null}
  </>
);

export const SwiperComponentMenu_ = ({
  isShowing,
  routeToEntityPage,
  removeComponent,
}: {
  isShowing: boolean;
  routeToEntityPage: () => void;
  removeComponent?: () => void;
}) => {
  return (
    <ContentMenu show={isShowing} styles={tw`absolute left-0 top-0`}>
      <ContentMenu.Button
        onClick={routeToEntityPage}
        tooltipProps={{ text: "go to article page" }}
      >
        <GoToPageIcon />
      </ContentMenu.Button>
      {removeComponent ? (
        <>
          <ContentMenu.VerticalBar />
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
        </>
      ) : null}
    </ContentMenu>
  );
};
