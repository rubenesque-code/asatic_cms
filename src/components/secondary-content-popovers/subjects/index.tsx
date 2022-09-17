import { ReactElement, ComponentProps } from "react";

import { useSelector } from "^redux/hooks";
import { selectDocSubjectsStatus } from "^redux/state/complex-selectors/subjects";

import DocSubjectsPanel from "./panel";

import Popover from "^components/ProximityPopover";

function DocSubjectsPopover({
  children: button,
  ...docSubjectsPanelProps
}: { children: ReactElement } & ComponentProps<typeof DocSubjectsPanel>) {
  return (
    <Popover>
      {({ isOpen }) => (
        <>
          <Popover.Panel isOpen={isOpen}>
            <DocSubjectsPanel {...docSubjectsPanelProps} />
          </Popover.Panel>
          <Popover.Button>{button}</Popover.Button>
        </>
      )}
    </Popover>
  );
}

export default DocSubjectsPopover;

export type ButtonWrapperProps = {
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

DocSubjectsPopover.Button = function SubjectsButton({
  children,
  docLanguagesIds,
  docSubjectsIds,
}: ButtonWrapperProps) {
  const docSubjectsStatus = useSelector((state) =>
    selectDocSubjectsStatus(state, docSubjectsIds, docLanguagesIds)
  );

  return typeof children === "function"
    ? children({ subjectsStatus: docSubjectsStatus })
    : children;
};
