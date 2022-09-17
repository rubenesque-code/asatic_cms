import { PenNib } from "phosphor-react";
import tw from "twin.macro";

import { MyOmit } from "^types/utilities";

import MissingTranslation from "^components/MissingTranslation";
import DocAuthorsPopover, {
  ButtonWrapperProps,
} from "^components/secondary-content-popovers/authors";

import HeaderIconButton from "./IconButton";

type Props = MyOmit<ButtonWrapperProps, "children">;

const AuthorsButton = (props: Props) => {
  return (
    <DocAuthorsPopover.Button {...props}>
      {({ authorsStatus }) => (
        <div css={[tw`relative`]}>
          <HeaderIconButton tooltip="authors">
            <PenNib />
          </HeaderIconButton>
          {authorsStatus.includes("missing translation") ? (
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
    </DocAuthorsPopover.Button>
  );
};

export default AuthorsButton;
