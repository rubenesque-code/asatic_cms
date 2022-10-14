import { ReactElement, ComponentProps } from "react";

import { useSelector } from "^redux/hooks";

import DocAuthorsPanel from "../../secondary-content-popovers/authors/panel";

import Popover from "^components/ProximityPopover";
import { selectDocAuthorsStatus } from "^redux/state/complex-selectors/authors";

function DocAuthorsPopover({
  children: button,
  ...docSubjectsPanelProps
}: { children: ReactElement } & ComponentProps<typeof DocAuthorsPanel>) {
  return (
    <Popover>
      <>
        <Popover.Panel>
          <DocAuthorsPanel {...docSubjectsPanelProps} />
        </Popover.Panel>
        <Popover.Button>{button}</Popover.Button>
      </>
    </Popover>
  );
}

export default DocAuthorsPopover;

export type ButtonWrapperProps = {
  children:
    | ReactElement
    | (({
        authorsStatus,
      }: {
        authorsStatus: ReturnType<typeof selectDocAuthorsStatus>;
      }) => ReactElement);
  docAuthorsIds: string[];
  docLanguagesIds: string[];
};

DocAuthorsPopover.Button = function SubjectsButton({
  children,
  docLanguagesIds,
  docAuthorsIds,
}: ButtonWrapperProps) {
  const docAuthorsStatus = useSelector((state) =>
    selectDocAuthorsStatus(state, docAuthorsIds, docLanguagesIds)
  );

  return typeof children === "function"
    ? children({ authorsStatus: docAuthorsStatus })
    : children;
};
