import tw from "twin.macro";

import MissingText from "^components/MissingText";
import { landingColorThemes } from "^data/landing";
import { LandingColorTheme } from "^types/landing";

const AutoSectionArticleLikeTitleUI = ({
  colorTheme,
  title,
}: {
  colorTheme: LandingColorTheme;
  title: string | undefined;
}) => (
  <h3 css={[tw`text-3xl`, landingColorThemes[colorTheme].text]}>
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
