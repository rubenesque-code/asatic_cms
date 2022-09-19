import { TagSimple } from "phosphor-react";
import tw from "twin.macro";

import { MyOmit } from "^types/utilities";

import DocTagsPopover, {
  ButtonWrapperProps,
} from "^components/secondary-content-popovers/tags";
import WithTooltip from "^components/WithTooltip";
import Header from "../Header";

type Props = MyOmit<ButtonWrapperProps, "children">;

const TagsButton = (props: Props) => {
  return (
    <DocTagsPopover.Button {...props}>
      {({ docTagsStatus }) => (
        <div css={[tw`relative`]}>
          <Header.IconButton tooltip="subjects">
            <TagSimple />
          </Header.IconButton>
          {docTagsStatus.includes("missing entity") ? (
            <div
              css={[
                tw`z-40 absolute top-0 right-0 translate-x-2 -translate-y-0.5 scale-90`,
              ]}
            >
              <WithTooltip text={"missing tag"} placement="top">
                <span
                  css={[
                    tw`flex items-center gap-xxxs text-red-warning text-xs`,
                  ]}
                >
                  <span>!</span>
                </span>
              </WithTooltip>
            </div>
          ) : null}
        </div>
      )}
    </DocTagsPopover.Button>
  );
};

export default TagsButton;
