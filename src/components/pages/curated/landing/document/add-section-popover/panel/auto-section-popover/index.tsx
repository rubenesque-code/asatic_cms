import { ReactElement } from "react";

import Popover from "^components/ProximityPopover";

import Panel from "./panel";

function AddLandingSectionPopover({
  children: button,
}: {
  children: ReactElement;
}) {
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

export default AddLandingSectionPopover;
