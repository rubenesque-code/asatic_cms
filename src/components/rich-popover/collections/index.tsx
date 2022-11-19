import { ReactElement } from "react";

import { useSelector } from "^redux/hooks";
import { selectEntityCollectionsStatus } from "^redux/state/complex-selectors/collections";

import Popover from "^components/ProximityPopover";
import {
  ParentEntityProp,
  ComponentProvider,
  useComponentContext,
} from "./Context";
import Panel from "./panel";

export type CollectionsPopover_Props = {
  children: ReactElement;
} & ParentEntityProp;

export function CollectionsPopover_({
  children: button,
  ...contextProps
}: CollectionsPopover_Props) {
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

type CollectionsPopoverButtonProps = {
  children:
    | ReactElement
    | (({
        entityCollectionsStatus,
      }: {
        entityCollectionsStatus: ReturnType<
          typeof selectEntityCollectionsStatus
        >;
      }) => ReactElement);
};

export function CollectionsPopoverButton_({
  children,
}: CollectionsPopoverButtonProps) {
  const { parentEntityData } = useComponentContext();

  const status = useSelector((state) =>
    selectEntityCollectionsStatus(
      state,
      parentEntityData.collectionsIds,
      parentEntityData.translationLanguagesIds
    )
  );

  return typeof children === "function"
    ? children({ entityCollectionsStatus: status })
    : children;
}
