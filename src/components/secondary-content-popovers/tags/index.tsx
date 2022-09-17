import { ReactElement, ComponentProps } from "react";

import { useSelector } from "^redux/hooks";

import DocTagsPanel from "./panel";

import Popover from "^components/ProximityPopover";
import { selectTagsByIds } from "^redux/state/tags";

function DocTagsPopover({
  children: button,
  ...docTagsPanelProps
}: { children: ReactElement } & ComponentProps<typeof DocTagsPanel>) {
  return (
    <Popover>
      {({ isOpen }) => (
        <>
          <Popover.Panel isOpen={isOpen}>
            <DocTagsPanel {...docTagsPanelProps} />
          </Popover.Panel>
          <Popover.Button>{button}</Popover.Button>
        </>
      )}
    </Popover>
  );
}

export default DocTagsPopover;

export type ButtonWrapperProps = {
  children:
    | ReactElement
    | (({
        docTagsStatus,
      }: {
        docTagsStatus: "missing entity" | "good";
      }) => ReactElement);
  docTagsIds: string[];
};

DocTagsPopover.Button = function SubjectsButton({
  children,
  docTagsIds,
}: ButtonWrapperProps) {
  const docTags = useSelector((state) => selectTagsByIds(state, docTagsIds));
  const isMissingTag = docTags.includes(undefined);

  return typeof children === "function"
    ? children({ docTagsStatus: isMissingTag ? "missing entity" : "good" })
    : children;
};
