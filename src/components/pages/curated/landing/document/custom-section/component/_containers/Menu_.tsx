import tw from "twin.macro";
import { toast } from "react-toastify";

import {
  removeOne as removeCustomSectionComponent,
  updateComponentWidth,
} from "^redux/state/landing";

import ContentMenu from "^components/menus/Content";
import {
  GoToPageIcon,
  NarrowIcon,
  RemoveRelatedEntityIcon,
  TurnOnIcon,
  WidenIcon,
} from "^components/Icons";
import { useDispatch } from "^redux/hooks";
import { ReactElement } from "react";
import LandingCustomSectionComponentSlice from "^context/landing/LandingCustomSectionComponentContext";

type MenuGeneric_Props = {
  isShowing: boolean;
  children?: ReactElement | ReactElement[];
};

export const MenuGeneric_ = ({ children, isShowing }: MenuGeneric_Props) => {
  const dispatch = useDispatch();

  const [{ id: componentId }] = LandingCustomSectionComponentSlice.useContext();

  return (
    <ContentMenu show={isShowing} styles={tw`absolute left-0 top-sm`}>
      <ContentMenu.ButtonWithWarning
        tooltipProps={{ text: "remove component", type: "action" }}
        warningProps={{
          callbackToConfirm: () => {
            dispatch(removeCustomSectionComponent({ id: componentId }));
            toast.success("removed");
          },
          warningText: "Remove component?",
        }}
      >
        <RemoveRelatedEntityIcon />
      </ContentMenu.ButtonWithWarning>
      <>{children}</>
    </ContentMenu>
  );
};

export const MenuPopulated_ = ({
  routeToEntityPage,
  isShowing,
  usingImage,
  toggleUseImageOn,
}: {
  routeToEntityPage: () => void;
  usingImage: boolean;
  toggleUseImageOn: () => void;
} & MenuGeneric_Props) => {
  const dispatch = useDispatch();

  const [{ width, id: componentId, changeSpanIsDisabled }] =
    LandingCustomSectionComponentSlice.useContext();

  const canNarrow = !changeSpanIsDisabled && width === 2;
  const canWiden = !changeSpanIsDisabled && width === 1;

  return (
    <MenuGeneric_ isShowing={isShowing}>
      <ContentMenu.VerticalBar />
      <ContentMenu.Button
        onClick={routeToEntityPage}
        tooltipProps={{ text: "go to document page" }}
      >
        <GoToPageIcon />
      </ContentMenu.Button>
      <ContentMenu.VerticalBar />
      <ContentMenu.Button
        isDisabled={!canWiden}
        onClick={() =>
          canWiden &&
          dispatch(updateComponentWidth({ id: componentId, width: 2 }))
        }
        tooltipProps={{
          text: "widen",
          type: "action",
        }}
      >
        <WidenIcon />
      </ContentMenu.Button>
      <ContentMenu.Button
        isDisabled={!canNarrow}
        onClick={() =>
          canNarrow &&
          dispatch(updateComponentWidth({ id: componentId, width: 1 }))
        }
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
    </MenuGeneric_>
  );
};
