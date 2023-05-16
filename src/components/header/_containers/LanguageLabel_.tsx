import tw from "twin.macro";
import { TranslateIcon } from "^components/Icons";
import { useSelector } from "^redux/hooks";
import { selectLanguageById } from "^redux/state/languages";

export const LanguageLabel_ = ({ languageId }: { languageId: string }) => {
  const language = useSelector((state) =>
    selectLanguageById(state, languageId)
  );

  return (
    <div css={[tw`flex gap-xxxs items-center`]}>
      <span
        css={[
          tw`p-xxs rounded-full text-gray-500 text-base bg-white`,
          tw`text-sm -translate-y-1`,
        ]}
      >
        <TranslateIcon />
      </span>
      <p css={[tw`text-sm`]}>{language!.name}</p>
    </div>
  );
};
