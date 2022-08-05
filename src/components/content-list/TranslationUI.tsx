import { ReactElement } from "react";
import tw from "twin.macro";

import MissingText from "^components/MissingText";

const TranslationUI = ({
  isNotFirstInList,
  translationLanguage,
  translationTitle,
}: {
  isNotFirstInList: boolean;
  translationLanguage: ReactElement;
  translationTitle: string | undefined | ReactElement;
}) => (
  <div css={[tw`flex items-center gap-sm`]}>
    {isNotFirstInList ? (
      <div css={[tw`h-[20px] w-[0.5px] bg-gray-200`]} />
    ) : null}
    <div css={[tw`flex gap-xs`]}>
      {translationTitle ? (
        <div>{translationTitle}</div>
      ) : (
        <MissingText tooltipText="missing translation title" />
      )}
      {translationLanguage}
    </div>
  </div>
);

export default TranslationUI;
