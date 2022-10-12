import { ReactElement, ComponentProps } from "react";

import Panel from "./panel";

import Popover from "^components/ProximityPopover";

function TypePopover({
  children: button,
  ...panelProps
}: { children: ReactElement } & ComponentProps<typeof Panel>) {
  return (
    <Popover>
      <>
        <Popover.Panel>
          <Panel {...panelProps} />
        </Popover.Panel>
        <Popover.Button>{button}</Popover.Button>
      </>
    </Popover>
  );
}

export default TypePopover;
