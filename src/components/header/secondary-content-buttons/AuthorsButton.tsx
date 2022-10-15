import { PenNib } from "phosphor-react";
import tw from "twin.macro";

import MissingTranslation from "^components/MissingTranslation";
import { AuthorsPopoverButton_ } from "^components/related-entity-popover/authors";

import Header from "../Header";

const AuthorsButton = () => {
  return (
    <AuthorsPopoverButton_>
      {({ authorsStatus }) => (
        <div css={[tw`relative`]}>
          <Header.IconButton tooltip="authors">
            <PenNib />
          </Header.IconButton>
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
    </AuthorsPopoverButton_>
  );
};

export default AuthorsButton;
