import { CirclesFour } from "phosphor-react";
import tw from "twin.macro";

import { MyOmit } from "^types/utilities";

import MissingTranslation from "^components/MissingTranslation";
import DocCollectionsPopover, {
  ButtonWrapperProps,
} from "^components/secondary-content-popovers/collections";
import Header from "../Header";

type Props = MyOmit<ButtonWrapperProps, "children">;

const CollectionsButton = (props: Props) => {
  return (
    <DocCollectionsPopover.Button {...props}>
      {({ collectionsStatus }) => (
        <div css={[tw`relative`]}>
          <Header.IconButton tooltip="collections">
            <CirclesFour />
          </Header.IconButton>
          {collectionsStatus.includes("missing translation") ? (
            <div
              css={[
                tw`z-40 absolute top-0 right-0 translate-x-2 -translate-y-0.5 scale-90`,
              ]}
            >
              <MissingTranslation tooltipText="missing translation" />
            </div>
          ) : null}
        </div>
      )}
    </DocCollectionsPopover.Button>
  );
};

export default CollectionsButton;
