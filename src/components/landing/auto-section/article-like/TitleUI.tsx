import tw from "twin.macro";

import MissingText from "^components/MissingText";

const AutoSectionArticleLikeTitleUI = ({
  title,
}: {
  title: string | undefined;
}) => (
  <h3 css={[tw`text-blue-dark-content text-3xl`]}>
    {title ? (
      title
    ) : (
      <div css={[tw`flex items-center gap-sm`]}>
        <span css={[tw`text-gray-placeholder`]}>title...</span>
        <MissingText tooltipText="missing title for language" />
      </div>
    )}
  </h3>
);

export default AutoSectionArticleLikeTitleUI;
