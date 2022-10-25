import { ReactElement } from "react";

import Panel from "./panel";

import Popover from "^components/ProximityPopover";

export function TypePopover({ children: button }: { children: ReactElement }) {
  return (
    <Popover>
      <>
        <Popover.Panel>
          <Panel />
        </Popover.Panel>
        <Popover.Button>{button}</Popover.Button>
      </>
    </Popover>
  );
}
