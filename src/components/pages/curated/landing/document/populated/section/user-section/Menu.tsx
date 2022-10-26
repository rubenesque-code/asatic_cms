import { Plus } from "phosphor-react";

import ContentMenu from "^components/menus/Content";
import { Menu_ } from "../_containers/Menu_";
import PrimaryEntityPopover from "./PrimaryEntityPopover";

const Menu = ({ isShowing }: { isShowing: boolean }) => {
  return (
    <Menu_
      isShowing={isShowing}
      extraButtons={
        <>
          <PrimaryEntityPopover>
            <ContentMenu.Button
              tooltipProps={{ text: "add component to section" }}
            >
              <Plus />
            </ContentMenu.Button>
          </PrimaryEntityPopover>
          <ContentMenu.VerticalBar />
        </>
      }
    />
  );
};

export default Menu;
