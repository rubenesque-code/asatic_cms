import { ReactElement, ComponentProps } from "react";

import Panel from "./panel";

import Popover from "^components/ProximityPopover";

export function TypePopover({
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
