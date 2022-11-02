import { ReactElement } from "react";

import { useSelector } from "^redux/hooks";
import { selectEntitySubjectsStatus } from "^redux/state/complex-selectors/subjects";

import Popover from "^components/ProximityPopover";
import {
  ComponentContextValue,
  ComponentProvider,
  useComponentContext,
} from "./Context";
import Panel from "./panel";

export type SubjectsPopover_Props = {
  children: ReactElement;
  parentData: ComponentContextValue[0];
  parentActions: ComponentContextValue[1];
};

export function SubjectsPopover_({
  children: button,
  ...contextProps
}: SubjectsPopover_Props) {
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

type SubjectsPopoverButtonProps = {
  children:
    | ReactElement
    | (({
        subjectStatus,
      }: {
        subjectStatus: ReturnType<typeof selectEntitySubjectsStatus>;
      }) => ReactElement);
};

export function SubjectsPopoverButton_({
  children,
}: SubjectsPopoverButtonProps) {
  const [{ subjectsIds, languagesIds }] = useComponentContext();
  const subjectStatus = useSelector((state) =>
    selectEntitySubjectsStatus(state, subjectsIds, languagesIds)
  );

  return typeof children === "function"
    ? children({ subjectStatus: subjectStatus })
    : children;
}
