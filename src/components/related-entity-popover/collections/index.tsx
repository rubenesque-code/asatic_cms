import { ReactElement } from "react";

import { useSelector } from "^redux/hooks";
import { selectEntityCollectionsStatus } from "^redux/state/complex-selectors/collections";

import Popover from "^components/ProximityPopover";
import {
  ComponentContextValue,
  ComponentProvider,
  useComponentContext,
} from "./Context";
import Panel from "./panel";

function CollectionsPopover_({
  children: button,
  ...contextProps
}: {
  children: ReactElement;
  parentData: ComponentContextValue[0];
  parentActions: ComponentContextValue[1];
}) {
  return (
    <Popover>
      <ComponentProvider {...contextProps}>
        <>
          <Popover.Panel>
            <Panel />
          </Popover.Panel>
          <Popover.Button>{button}</Popover.Button>
        </>
      </ComponentProvider>
    </Popover>
  );
}

export default CollectionsPopover_;

export type ButtonWrapperProps = {
  children:
    | ReactElement
    | (({
        entityAuthorsStatus,
      }: {
        entityAuthorsStatus: ReturnType<typeof selectEntityCollectionsStatus>;
      }) => ReactElement);
};

export function CollectionsPopoverButton_({ children }: ButtonWrapperProps) {
  const [{ parentCollectionsIds, parentLanguagesIds }] = useComponentContext();

  const status = useSelector((state) =>
    selectEntityCollectionsStatus(
      state,
      parentCollectionsIds,
      parentLanguagesIds
    )
  );

  return typeof children === "function"
    ? children({ entityAuthorsStatus: status })
    : children;
}
