import tw from "twin.macro";

import MissingText from "^components/MissingText";

const AutoSectionArticleLikePublishDateUI = ({
  date,
}: {
  date: string | null;
}) => (
  <p css={[tw`font-sans tracking-wider font-light text-articleText`]}>
    {date ? (
      date
    ) : (
      <span css={[tw`flex items-center gap-sm`]}>
        <span css={[tw`text-gray-placeholder`]}>date...</span>
        <MissingText tooltipText="missing publish date" />
      </span>
    )}
  </p>
);

export default AutoSectionArticleLikePublishDateUI;
