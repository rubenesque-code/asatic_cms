import { ReactElement, ComponentProps } from "react";

import { useSelector } from "^redux/hooks";
import { selectEntityCollectionsStatus } from "^redux/state/complex-selectors/collections";

import DocCollectionsPanel from "./panel";

import Popover from "^components/ProximityPopover";

function DocCollectionsPopover({
  children: button,
  ...docCollectionsPanelProps
}: { children: ReactElement } & ComponentProps<typeof DocCollectionsPanel>) {
  return (
    <Popover>
      <>
        <Popover.Panel>
          <DocCollectionsPanel {...docCollectionsPanelProps} />
        </Popover.Panel>
        <Popover.Button>{button}</Popover.Button>
      </>
    </Popover>
  );
}

export default DocCollectionsPopover;

export type ButtonWrapperProps = {
  children:
    | ReactElement
    | (({
        collectionsStatus,
      }: {
        collectionsStatus: ReturnType<typeof selectEntityCollectionsStatus>;
      }) => ReactElement);
  docCollectionsIds: string[];
  docLanguagesIds: string[];
};

DocCollectionsPopover.Button = function SubjectsButton({
  children,
  docLanguagesIds,
  docCollectionsIds,
}: ButtonWrapperProps) {
  const docCollectionsStatus = useSelector((state) =>
    selectEntityCollectionsStatus(state, docCollectionsIds, docLanguagesIds)
  );

  return typeof children === "function"
    ? children({ collectionsStatus: docCollectionsStatus })
    : children;
};
