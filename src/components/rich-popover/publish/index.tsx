import { ReactElement } from "react";

import ProximityPopover from "^components/ProximityPopover";
import { Publishable } from "^types/display-entity";
import Panel from "./panel";
import {
  ComponentContextValue,
  ComponentProvider,
  useComponentContext,
} from "./Context";

const PublishPopover_ = ({
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

export default PublishPopover_;

export const PublishPopoverButton = ({
  children,
}: {
  children: (publishStatus: Publishable["publishStatus"]) => ReactElement;
}) => {
  const { publishStatus } = useComponentContext();

  return children(publishStatus);
};
