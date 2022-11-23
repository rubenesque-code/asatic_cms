import { ReactElement } from "react";

import { useSelector } from "^redux/hooks";

import Popover from "^components/ProximityPopover";
import {
  ParentEntityProp,
  ComponentProvider,
  useComponentContext,
} from "./Context";
import Panel from "./panel";
import { selectEntityTagsStatus } from "^redux/state/complex-selectors/entity-status/tag";

export type TagsPopover_Props = {
  children: ReactElement;
} & ParentEntityProp;

export function TagsPopover_({
  children: button,
  ...contextProps
}: TagsPopover_Props) {
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

type TagsPopoverButtonProps = {
  children:
    | ReactElement
    | (({
        entityTagsStatus,
      }: {
        entityTagsStatus: ReturnType<typeof selectEntityTagsStatus>;
      }) => ReactElement);
};

export function TagsPopoverButton_({ children }: TagsPopoverButtonProps) {
  const { parentEntityData } = useComponentContext();

  const entityTagsStatus = useSelector((state) =>
    selectEntityTagsStatus(state, parentEntityData.tagsIds)
  );

  return typeof children === "function"
    ? children({ entityTagsStatus })
    : children;
}
