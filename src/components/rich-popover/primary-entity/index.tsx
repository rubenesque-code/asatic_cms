import { ReactElement } from "react";

import { ComponentContextValue, ComponentProvider } from "./Context";

import { MyOmit } from "^types/utilities";

import Popover from "^components/ProximityPopover";
import Panel from "./panel";

function PrimaryEntityPopover_({
  children: button,
  parentActions,
  parentData,
}: {
  children: ReactElement;
  parentData: ComponentContextValue[0];
  parentActions: MyOmit<ComponentContextValue[1], "closePopover">;
}) {
  return (
    <Popover>
      <>
        <Popover.Panel>
          {({ close: closePopover }) => (
            <ComponentProvider
              parentActions={{ ...parentActions, closePopover }}
              parentData={parentData}
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

export default PrimaryEntityPopover_;
