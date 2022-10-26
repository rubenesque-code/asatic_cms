import { ReactElement } from "react";
import tw from "twin.macro";

import LandingCustomSectionComponentSlice from "^context/landing/LandingCustomSectionComponentContext";

import ContentMenu from "^components/menus/Content";
import {
  GoToPageIcon,
  NarrowIcon,
  RemoveRelatedEntityIcon,
  WidenIcon,
} from "^components/Icons";

export const Menu_ = ({
  children: extraButtons,
  isShowing,
  routeToEntityPage,
}: {
  children?: ReactElement | null;
  isShowing: boolean;
  routeToEntityPage?: () => void;
}) => {
  const [
    { width, changeSpanIsDisabled },
    { deleteComponentFromCustom, updateComponentWidth },
  ] = LandingCustomSectionComponentSlice.useContext();

  const canNarrow = !changeSpanIsDisabled && width > 1;
  const canWiden = !changeSpanIsDisabled && width < 3;

  return (
    <ContentMenu styles={tw`absolute left-0 top-sm`} show={isShowing}>
      <ContentMenu.ButtonWithWarning
        tooltipProps={{ text: "remove component", type: "action" }}
        warningProps={{
          callbackToConfirm: deleteComponentFromCustom,
          warningText: "Remove component?",
        }}
      >
        <RemoveRelatedEntityIcon />
      </ContentMenu.ButtonWithWarning>
      <ContentMenu.VerticalBar />
      {routeToEntityPage ? (
        <>
          <ContentMenu.Button
            onClick={routeToEntityPage}
            tooltipProps={{ text: "go to document page" }}
          >
            <GoToPageIcon />
          </ContentMenu.Button>
          <ContentMenu.VerticalBar />
        </>
      ) : null}
      <ContentMenu.Button
        isDisabled={!canWiden}
        onClick={() => updateComponentWidth({ width: width + 1 })}
        tooltipProps={{
          text: changeSpanIsDisabled
            ? {
                header: "disabled",
                body: "can't change component span when the browser is too narrow.",
              }
            : "widen",
          type: changeSpanIsDisabled ? "extended-info" : "action",
        }}
      >
        <WidenIcon />
      </ContentMenu.Button>
      <ContentMenu.Button
        isDisabled={!canNarrow}
        onClick={() => updateComponentWidth({ width: width - 1 })}
        tooltipProps={{
          text: changeSpanIsDisabled
            ? {
                header: "disabled",
                body: "can't change component span when the browser is too narrow.",
              }
            : "narrow",
          type: changeSpanIsDisabled ? "extended-info" : "action",
        }}
      >
        <NarrowIcon />
      </ContentMenu.Button>
      {extraButtons ? extraButtons : null}
    </ContentMenu>
  );
};

export default Menu_;
