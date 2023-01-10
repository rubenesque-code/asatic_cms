import { ReactElement } from "react";
import tw from "twin.macro";
import { Popover } from "@headlessui/react";

import { ParentEntityProp, ComponentProvider } from "./Context";

// import Popover from "^components/ProximityPopover";
import Panel from "./panel";

// containerStyles for width of panel
export type ArticleLikeEntityPopover_Props = {
  children: ReactElement;
} & ParentEntityProp;

export function ArticleLikeEntityPopover_({
  children: button,
  parentEntity,
}: ArticleLikeEntityPopover_Props) {
  return (
    <Popover>
      <Popover.Panel
        css={[
          tw`z-50 fixed w-[calc(100vw - 4em)] max-w-[1000px] top-lg left-lg max-h-[90vh] `,
        ]}
      >
        {({ close: closePopover }) => (
          <ComponentProvider
            closePopover={closePopover}
            parentEntity={parentEntity}
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
