import { ReactElement } from "react";

import { useSelector } from "^redux/hooks";

import Popover from "^components/ProximityPopover";
import {
  ComponentContextValue,
  ComponentProvider,
  useComponentContext,
} from "./Context";
import Panel from "./panel";
import { selectTagsByIds } from "^redux/state/tags";

export type TagsPopover_Props = {
  children: ReactElement;
  parentData: ComponentContextValue[0];
  parentActions: ComponentContextValue[1];
};

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
        entityTagsStatus: "missing entity" | "good";
      }) => ReactElement);
};

export function TagsPopoverButton_({ children }: TagsPopoverButtonProps) {
  const [{ parentTagsIds }] = useComponentContext();

  const docTags = useSelector((state) => selectTagsByIds(state, parentTagsIds));
  const isMissingTag = docTags.includes(undefined);

  return typeof children === "function"
    ? children({ entityTagsStatus: isMissingTag ? "missing entity" : "good" })
    : children;
}
