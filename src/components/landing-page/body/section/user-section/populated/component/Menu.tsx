import { ReactElement } from "react";
import tw from "twin.macro";

import LandingCustomSectionComponentSlice from "^context/landing/LandingCustomSectionComponentContext";

import ContentMenu from "^components/menus/Content";
import {
  NarrowIcon,
  RemoveRelatedEntityIcon,
  WidenIcon,
} from "^components/Icons";

export const Menu = ({
  isShowing,
  children: extraButtons,
}: {
  isShowing: boolean;
  children?: ReactElement;
}) => {
  const [{ width }, { deleteComponentFromCustom, updateComponentWidth }] =
    LandingCustomSectionComponentSlice.useContext();

  const canNarrow = width > 1;
  const canWiden = width < 3;

  return (
    <ContentMenu styles={tw`absolute left-0 bottom-10`} show={isShowing}>
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
      <ContentMenu.Button
        isDisabled={!canWiden}
        onClick={() => updateComponentWidth({ width: width + 1 })}
        tooltipProps={{ text: "widen" }}
      >
        <WidenIcon />
      </ContentMenu.Button>
      <ContentMenu.Button
        isDisabled={!canNarrow}
        onClick={() => updateComponentWidth({ width: width - 1 })}
        tooltipProps={{ text: "narrow" }}
      >
        <NarrowIcon />
      </ContentMenu.Button>
      {extraButtons ? extraButtons : null}
    </ContentMenu>
  );
};

export default Menu;
