import { PenNib } from "phosphor-react";
import tw from "twin.macro";

import HeaderIconButton from "^components/header/IconButton";
import MissingTranslation from "^components/MissingTranslation";
import WithDocAuthors, { Props } from "^components/WithEditDocAuthors";

const AuthorssPopover = (props: Props) => {
  return (
    <WithDocAuthors {...props}>
      {({ isMissingTranslation }) => (
        <AuthorsPopoverButtonUI isMissingTranslation={isMissingTranslation} />
      )}
    </WithDocAuthors>
  );
};

export default AuthorssPopover;

const AuthorsPopoverButtonUI = ({
  isMissingTranslation,
}: {
  isMissingTranslation: boolean;
}) => (
  <div css={[tw`relative`]}>
    <HeaderIconButton tooltip="authors">
      <PenNib />
    </HeaderIconButton>
    {isMissingTranslation ? (
      <div
        css={[
          tw`z-40 absolute top-0 right-0 translate-x-2 -translate-y-0.5 scale-90`,
        ]}
      >
        <MissingTranslation />
      </div>
    ) : null}
  </div>
);
