import { ReactElement } from "react";
import tw from "twin.macro";
import { Popover } from "@headlessui/react";

import { ComponentContextValue, ComponentProvider } from "./Context";

import { MyOmit } from "^types/utilities";

// import Popover from "^components/ProximityPopover";
import Panel from "./panel";

// containerStyles for width of panel
export type PrimaryEntityPopover_Props = {
  children: ReactElement;
  parentData: ComponentContextValue[0];
  parentActions: MyOmit<ComponentContextValue[1], "closePopover">;
};

export function PrimaryEntityPopover_({
  children: button,
  parentActions,
  parentData,
}: PrimaryEntityPopover_Props) {
  return (
    <Popover>
      <Popover.Panel
        css={[
          tw`z-50 fixed w-[calc(100vw - 4em)] max-w-[1000px] top-lg left-lg max-h-[90vh] `,
        ]}
      >
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
      <Popover.Overlay css={[tw`fixed inset-0 bg-overlayLight`]} />
    </Popover>
  );
}
