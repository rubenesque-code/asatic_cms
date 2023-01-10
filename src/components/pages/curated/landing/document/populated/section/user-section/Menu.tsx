import { Plus } from "phosphor-react";

import ContentMenu from "^components/menus/Content";
import { Menu_ } from "../_containers/Menu_";
import EntityPopover from "./EntityPopover";

const Menu = ({ isShowing }: { isShowing: boolean }) => {
  return (
    <Menu_
      isShowing={isShowing}
      extraButtons={
        <>
          <EntityPopover>
            <ContentMenu.Button
              tooltipProps={{ text: "add component to section" }}
            >
              <Plus />
            </ContentMenu.Button>
          </EntityPopover>
          <ContentMenu.VerticalBar />
        </>
      }
    />
  );
};

export default Menu;
