import { ReactElement } from "react";
import tw from "twin.macro";

import HandleDocLanguage from "^components/handle-related-entity/Language";
import { TranslateIcon } from "^components/Icons";

export const Translation_ = ({
  children: text,
  languageId,
  type,
}: {
  children: ReactElement;
  languageId: string;
  type: "active" | "inactive";
}) => (
  <div css={[tw`flex`, type === "inactive" && tw`opacity-40`]}>
    {text}
    <TranslationLanguage_ languageId={languageId} />
  </div>
);

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
