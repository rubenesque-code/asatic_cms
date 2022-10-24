import { ReactElement } from "react";

import ProximityPopover from "^components/ProximityPopover";
import { Publishable } from "^types/display-entity";
import Panel from "./panel";
import {
  ComponentContextValue,
  ComponentProvider,
  useComponentContext,
} from "./Context";

export type PublishPopover_Props = {
  children: ReactElement;
} & ComponentContextValue;

export const PublishPopover_ = ({
  children: button,
  ...providerProps
}: PublishPopover_Props) => {
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

export const PublishPopoverButton = ({
  children,
}: {
  children: (publishStatus: Publishable["publishStatus"]) => ReactElement;
}) => {
  const { publishStatus } = useComponentContext();

  return children(publishStatus);
};
