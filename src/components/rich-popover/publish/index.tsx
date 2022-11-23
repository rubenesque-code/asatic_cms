import { ReactElement } from "react";

import ProximityPopover from "^components/ProximityPopover";
import Panel from "./panel";
import {
  ComponentContextValue,
  ComponentProvider,
  useComponentContext,
} from "./Context";
import { PublishFields } from "^types/entity";

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
  children: (publishStatus: PublishFields["publishStatus"]) => ReactElement;
}) => {
  const { publishStatus } = useComponentContext();

  return children(publishStatus);
};
