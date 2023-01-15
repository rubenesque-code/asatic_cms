import tw from "twin.macro";

import { LandingCustomSectionComponent } from "^types/landing";

import { AddRelatedEntityIcon } from "^components/Icons";
import ContentMenu from "^components/menus/Content";
import AddEntityPopover from "./AddEntityPopover";

const Menu = ({
  isShowing,
  section,
}: {
  isShowing: boolean;
  section: LandingCustomSectionComponent["section"];
}) => {
  return (
    <ContentMenu show={isShowing} styles={tw`-right-6 -top-6`}>
      <AddEntityPopover section={section}>
        <ContentMenu.Button tooltipProps={{ text: "add component to section" }}>
          <AddRelatedEntityIcon />
        </ContentMenu.Button>
      </AddEntityPopover>
    </ContentMenu>
  );
};

export default Menu;
