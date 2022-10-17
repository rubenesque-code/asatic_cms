import { ReactElement } from "react";

import ProximityPopover from "^components/ProximityPopover";
import Panel from "./panel";
import { ComponentContextValue, ComponentProvider } from "./Context";

const EntityPageSettingsPopover_ = ({
  children: button,
  ...providerProps
}: {
  children: ReactElement;
} & ComponentContextValue) => {
  return (
    <ProximityPopover>
      <ComponentProvider {...providerProps}>
        <>
          <ProximityPopover.Button>{button}</ProximityPopover.Button>
          <ProximityPopover.Panel>
            <Panel />
          </ProximityPopover.Panel>
        </>
      </ComponentProvider>
    </ProximityPopover>
  );
};

export default EntityPageSettingsPopover_;
