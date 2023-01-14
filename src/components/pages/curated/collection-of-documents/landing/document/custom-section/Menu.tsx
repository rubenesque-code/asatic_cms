import { Plus } from "phosphor-react";
import tw from "twin.macro";
import ContentMenu from "^components/menus/Content";
import { LandingCustomSectionComponent } from "^types/landing";
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
          <Plus />
        </ContentMenu.Button>
      </AddEntityPopover>
    </ContentMenu>
  );
};

export default Menu;
