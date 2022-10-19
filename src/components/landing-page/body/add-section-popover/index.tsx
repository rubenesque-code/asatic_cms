import { ReactElement } from "react";

import Popover from "^components/ProximityPopover";

import { ComponentProvider } from "./Context";
import Panel from "./panel";

function AddLandingSectionPopover({
  children: button,
  newSectionIndex,
}: {
  children: ReactElement;
  newSectionIndex: number;
}) {
  return (
    <Popover>
      <>
        <Popover.Panel>
          {({ close: closePopover }) => (
            <ComponentProvider
              closePopover={closePopover}
              newSectionIndex={newSectionIndex}
            >
              <Panel />
            </ComponentProvider>
          )}
        </Popover.Panel>
        <Popover.Button>{button}</Popover.Button>
      </>
    </Popover>
  );
}

export default AddLandingSectionPopover;
