import { ReactElement } from "react";

import ProximityPopover from "^components/ProximityPopover";
import Panel from "./panel";

export const DeployPopover = ({
  children: button,
}: {
  children: ReactElement;
}) => {
  return (
    <ProximityPopover>
      <>
        <ProximityPopover.Button>{button}</ProximityPopover.Button>
        <ProximityPopover.Panel>
          <Panel />
        </ProximityPopover.Panel>
      </>
    </ProximityPopover>
  );
};
