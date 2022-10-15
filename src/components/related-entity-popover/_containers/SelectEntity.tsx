import tw from "twin.macro";
import { TranslationLanguage_ } from "^components/_containers/TranslationLanguage";
import { $TranslationText } from "../_styles/selectEntities";

export const Translation_ = ({
  languageId,
  text,
}: {
  text: string;
  languageId: string;
}) => {
  return (
    <div css={[tw`flex flex-nowrap`]}>
      <$TranslationText>{text}</$TranslationText>
      <TranslationLanguage_ languageId={languageId} />
    </div>
  );
};
