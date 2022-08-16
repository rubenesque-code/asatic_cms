import { ReactElement } from "react";
import tw from "twin.macro";
import DivHover from "^components/DivHover";

import MissingText from "^components/MissingText";

const TranslationUI = ({
  deleteTranslationButton,
  isNotFirstInList,
  translationLanguage,
  translationTitle,
}: {
  deleteTranslationButton?:
    | null
    | ((translationIsHovered: boolean) => ReactElement);
  isNotFirstInList: boolean;
  translationLanguage: ReactElement;
  translationTitle: string | undefined | ReactElement;
}) => (
  <DivHover styles={tw`relative  flex items-center  gap-sm `}>
    {(isHovered) => (
      <>
        {isNotFirstInList ? (
          <div css={[tw`h-[20px] w-[0.5px] bg-gray-200`]} />
        ) : null}
        <div css={[tw`flex gap-xs`]}>
          {translationTitle ? (
            <div css={[tw``]}>{translationTitle}</div>
          ) : (
            <MissingText tooltipText="missing title" />
          )}
          {translationLanguage}
        </div>
        {deleteTranslationButton ? deleteTranslationButton(isHovered) : null}
      </>
    )}
  </DivHover>
);

export default TranslationUI;
