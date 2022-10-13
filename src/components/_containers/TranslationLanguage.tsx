import tw from "twin.macro";

import HandleDocLanguage from "^components/handle-related-entity/Language";
import { TranslateIcon } from "^components/Icons";

export const TranslationLanguage_ = ({
  languageId,
}: {
  languageId: string;
}) => {
  return (
    <div css={[tw`flex gap-xxxs`]}>
      <span css={[tw`text-xs text-gray-300`]}>
        <TranslateIcon />
      </span>
      <div css={[tw`text-sm text-gray-400`]}>
        <HandleDocLanguage languageId={languageId} />
      </div>
    </div>
  );
};
