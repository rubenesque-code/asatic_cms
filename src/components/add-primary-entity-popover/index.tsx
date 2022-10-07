import { ReactElement } from "react";
import { Popover } from "@headlessui/react";

import { ComponentProvider, ContextValue } from "./Context";
import { panelPositioning } from "./styles";
import Panel from "./panel";

const AddPrimaryEntityPopover = ({
  children: button,
  ...contextValue
}: { children: ReactElement } & ContextValue) => {
  return (
    <Popover>
      <>
        <Popover.Button>{button}</Popover.Button>
        <Popover.Panel css={[panelPositioning]}>
          {({ close }) => (
            <ComponentProvider {...contextValue}>
              <Panel closePopover={close} />
            </ComponentProvider>
          )}
        </Popover.Panel>
      </>
    </Popover>
  );
};

export default AddPrimaryEntityPopover;
