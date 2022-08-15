import { ReactElement } from "react";
import tw from "twin.macro";

import MissingText from "^components/MissingText";

const AutoSectionArticleSummaryUI = ({
  editor,
  isContent,
}: {
  editor: ReactElement;
  isContent: boolean;
}) => (
  <div css={[tw`relative text-articleText`]}>
    <div>{editor}</div>
    {!isContent ? (
      <div css={[tw`absolute right-0 top-0`]}>
        <MissingText tooltipText="Missing summary text for translation" />
      </div>
    ) : null}
  </div>
);

export default AutoSectionArticleSummaryUI;
