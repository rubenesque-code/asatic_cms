import { ReactElement, ComponentProps } from "react";

import { useSelector } from "^redux/hooks";
import { selectDocSubjectsStatus } from "^redux/state/complex-selectors/subjects";

import DocSubjectsPanel from "./Panel";

import Popover from "^components/ProximityPopover";

// type ComponentProps = PanelContextValue & ButtonProps;

function DocSubjects({
  children: button,
  ...panelProps
}: { children: ReactElement } & ComponentProps<typeof DocSubjectsPanel>) {
  return (
    <Popover>
      {({ isOpen }) => (
        <>
          <Popover.Panel isOpen={isOpen}>
            <DocSubjectsPanel {...panelProps} />
          </Popover.Panel>
          <Popover.Button>{button}</Popover.Button>
        </>
      )}
    </Popover>
  );
}

export default DocSubjects;

export type ButtonProps = {
  children:
    | ReactElement
    | (({
        subjectsStatus,
      }: {
        subjectsStatus: ReturnType<typeof selectDocSubjectsStatus>;
      }) => ReactElement);
  docSubjectsIds: string[];
  docLanguagesIds: string[];
};

DocSubjects.Button = function SubjectsButton({
  children,
  docLanguagesIds,
  docSubjectsIds,
}: ButtonProps) {
  const docSubjectsStatus = useSelector((state) =>
    selectDocSubjectsStatus(state, docSubjectsIds, docLanguagesIds)
  );

  return typeof children === "function"
    ? children({ subjectsStatus: docSubjectsStatus })
    : children;
};
