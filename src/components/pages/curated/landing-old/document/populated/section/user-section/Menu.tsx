import { Plus } from "phosphor-react";

import ContentMenu from "^components/menus/Content";
import { Menu_ } from "../_containers/Menu_";
import AddEntityPopover from "./AddEntityPopover";

const Menu = ({ isShowing }: { isShowing: boolean }) => {
  return (
    <Menu_
      isShowing={isShowing}
      extraButtons={
        <>
          <AddEntityPopover>
            <ContentMenu.Button
              tooltipProps={{ text: "add component to section" }}
            >
              <Plus />
            </ContentMenu.Button>
          </AddEntityPopover>
          <ContentMenu.VerticalBar />
        </>
      }
    />
  );
};

export default Menu;
