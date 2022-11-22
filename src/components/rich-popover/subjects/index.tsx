import { ReactElement } from "react";

import { useSelector } from "^redux/hooks";
import { selectEntitySubjectsStatus } from "^redux/state/complex-selectors/entity-status/subject";

import Popover from "^components/ProximityPopover";
import {
  ParentEntityProp,
  ComponentProvider,
  useComponentContext,
} from "./Context";
import Panel from "./panel";

export type SubjectsPopover_Props = {
  children: ReactElement;
} & ParentEntityProp;

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
        subjectsStatus,
      }: {
        subjectsStatus: ReturnType<typeof selectEntitySubjectsStatus>;
      }) => ReactElement);
};

export function SubjectsPopoverButton_({
  children,
}: SubjectsPopoverButtonProps) {
  const { parentEntityData } = useComponentContext();
  const subjectStatus = useSelector((state) =>
    selectEntitySubjectsStatus(
      state,
      parentEntityData.subjectIds,
      parentEntityData.translationLanguagesIds
    )
  );

  return typeof children === "function"
    ? children({ subjectsStatus: subjectStatus })
    : children;
}
