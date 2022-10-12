import { ReactElement } from "react";

import Popover from "^components/ProximityPopover";

import Panel from "./Panel";

function AddLandingSectionPopover({
  children: button,
  newSectionIndex,
}: {
  children: ReactElement;
  newSectionIndex: number;
}) {
  return (
    <Popover>
      {({ isOpen }) => (
        <>
          <Popover.Panel isOpen={isOpen}>
            {({ close: closePopover }) => (
              <Panel
                closePopover={closePopover}
                newSectionIndex={newSectionIndex}
              />
            )}
          </Popover.Panel>
          <Popover.Button>{button}</Popover.Button>
        </>
      )}
    </Popover>
  );
}

export default AddLandingSectionPopover;

AddLandingSectionPopover.Button = Popover.Button;
