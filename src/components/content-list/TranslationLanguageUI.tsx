import { Translate as TranslateIcon } from "phosphor-react";
import tw from "twin.macro";
import LanguageMissingFromStore from "^components/LanguageMissingFromStore";
import { Language } from "^types/language";

const TranslationLanguageUI = ({
  language,
}: {
  language: Language | undefined;
}) => (
  <p css={[tw`flex gap-xxxs items-center`]}>
    <span css={[tw`text-xs -translate-y-1 text-gray-500`]}>
      <TranslateIcon />
    </span>
    {language ? (
      <span css={[tw`text-gray-600`]}>{language.name}</span>
    ) : (
      <LanguageMissingFromStore />
    )}
  </p>
);

export default TranslationLanguageUI;
