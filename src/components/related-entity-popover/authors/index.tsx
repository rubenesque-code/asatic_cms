import { ReactElement } from "react";

import { useSelector } from "^redux/hooks";
import { selectDocAuthorsStatus } from "^redux/state/complex-selectors/authors";

import Popover from "^components/ProximityPopover";
import { ComponentContextValue, ComponentProvider } from "./Context";
import Panel from "./panel";

function EntityAuthorsPopover({
  children: button,
  ...contextProps
}: { children: ReactElement } & ComponentContextValue) {
  return (
    <Popover>
      <>
        <Popover.Panel>
          <ComponentProvider {...contextProps}>
            <Panel />
          </ComponentProvider>
        </Popover.Panel>
        <Popover.Button>{button}</Popover.Button>
      </>
    </Popover>
  );
}

export default EntityAuthorsPopover;

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

EntityAuthorsPopover.Button = function EntityAuthorsButton({
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
