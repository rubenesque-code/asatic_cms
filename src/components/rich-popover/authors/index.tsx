import { ReactElement } from "react";

import { useSelector } from "^redux/hooks";
import { selectDocAuthorsStatus as selectEntityAuthorsStatus } from "^redux/state/complex-selectors/authors";

import Popover from "^components/ProximityPopover";
import {
  ParentEntityProp,
  ComponentProvider,
  useComponentContext,
} from "./Context";
import Panel from "./panel";

export type AuthorsPopover_Props = {
  children: ReactElement;
} & ParentEntityProp;

export function AuthorsPopover_({
  children: button,
  parentEntity,
}: AuthorsPopover_Props) {
  return (
    <Popover>
      <ComponentProvider parentEntity={parentEntity}>
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

type AuthorsPopoverButtonProps = {
  children:
    | ReactElement
    | (({
        authorsStatus,
      }: {
        authorsStatus: ReturnType<typeof selectEntityAuthorsStatus>;
      }) => ReactElement);
};

export function AuthorsPopoverButton_({ children }: AuthorsPopoverButtonProps) {
  const { parentEntityData } = useComponentContext();

  const authorsStatus = useSelector((state) =>
    selectEntityAuthorsStatus(
      state,
      parentEntityData.authorsIds,
      parentEntityData.translationLanguagesIds
    )
  );

  return typeof children === "function"
    ? children({ authorsStatus: authorsStatus })
    : children;
}
