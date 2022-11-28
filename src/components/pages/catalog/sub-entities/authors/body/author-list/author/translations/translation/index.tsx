import tw from "twin.macro";

import InlineTextEditor from "^components/editors/Inline";
import AuthorSlice from "^context/authors/AuthorContext";

import { AuthorTranslation } from "^types/author";

import { Translation_ } from "^catalog-pages/_containers";

export const $TranslationText = tw.div`text-gray-700 mr-xs whitespace-nowrap font-serif-eng`;

const Translation = ({ translation }: { translation: AuthorTranslation }) => {
  const [, { updateName }] = AuthorSlice.useContext();

  return (
    <Translation_ languageId={translation.languageId} type="active">
      <$TranslationText>
        <InlineTextEditor
          injectedValue={translation?.name || ""}
          onUpdate={(name) =>
            updateName({ name, translationId: translation.id })
          }
          placeholder="translation..."
        />
        {/* <div css={[tw`border-b w-full h-full`]} /> */}
        {/* </InlineTextEditor> */}
      </$TranslationText>
    </Translation_>
  );
};

export default Translation;
