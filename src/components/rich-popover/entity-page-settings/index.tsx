import { ReactElement } from "react";

import ProximityPopover from "^components/ProximityPopover";
import Panel from "./panel";
import { ComponentContextValue, ComponentProvider } from "./Context";

export type EntityPageSettingsPopover_Props = {
  children: ReactElement;
} & ComponentContextValue;

export const EntityPageSettingsPopover_ = ({
  children: button,
  ...providerProps
}: EntityPageSettingsPopover_Props) => {
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
