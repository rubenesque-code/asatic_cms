import { ReactElement } from "react";
import tw from "twin.macro";

const $TranslationDivider = tw.div`w-[1px] h-[15px] bg-gray-200`;

export const $EntityTranslationsSection_ = ({
  addTranslationPopover,
  children: translations,
}: {
  addTranslationPopover: ReactElement;
  children: ReactElement[];
}) => {
  return (
    <div>
      <div css={[tw`flex items-center gap-sm`]}>
        <h4 css={[tw`text-gray-600`]}>Translations</h4>
        <div>{addTranslationPopover}</div>
      </div>
      <div css={[tw`flex items-center gap-xs mt-xs`]}>
        {translations.map((translation, i) => (
          <div css={[tw`flex gap-sm items-baseline`]} key={i}>
            {i !== 0 ? <$TranslationDivider /> : null}
            {translation}
          </div>
        ))}
      </div>
    </div>
  );
};
