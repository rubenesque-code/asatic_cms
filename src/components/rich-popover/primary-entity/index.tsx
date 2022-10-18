import { ReactElement } from "react";

import Popover from "^components/ProximityPopover";
import { ComponentContextValue, ComponentProvider } from "./Context";
import Panel from "./panel";

function PrimaryEntityPopover_({
  children: button,
  ...contextProps
}: {
  children: ReactElement;
  parentData: ComponentContextValue[0];
  parentActions: ComponentContextValue[1];
}) {
  return (
    <Popover>
      <ComponentProvider {...contextProps}>
        <>
          <Popover.Panel>
            <Panel />
          </Popover.Panel>
          <Popover.Button>{button}</Popover.Button>
        </>
      </ComponentProvider>
    </Popover>
  );
}

export default PrimaryEntityPopover_;
