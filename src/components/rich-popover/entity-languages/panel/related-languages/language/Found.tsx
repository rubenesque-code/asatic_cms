import { useDispatch } from "^redux/hooks";
import { updateName } from "^redux/state/languages";

import { Language } from "^types/language";

import InlineTextEditor from "^components/editors/Inline";
import { $MissingTranslationText as $MissingText } from "^components/rich-popover/_presentation/RelatedEntities";
import { $TranslationText as $Text } from "^components/rich-popover/_styles/relatedEntities";
import tw from "twin.macro";
import { Check } from "phosphor-react";
import { useEntityLanguageContext } from "^context/EntityLanguages";
import WithTooltip from "^components/WithTooltip";

const Found = ({ language }: { language: Language }) => {
  const { activeLanguageId, updateActiveLanguage } = useEntityLanguageContext();

  const dispatch = useDispatch();

  return (
    <div css={[tw`flex items-center gap-md`]} className="group">
      <div css={[tw`cursor-pointer hover:bg-gray-50`]}>
        <$Text>
          <InlineTextEditor
            injectedValue={language.name}
            onUpdate={(name) => dispatch(updateName({ id: language.id, name }))}
            placeholder=""
          >
            {!language.name?.length ? () => <$MissingText /> : null}
          </InlineTextEditor>
        </$Text>
      </div>
      <WithTooltip
        text={
          language.id === activeLanguageId
            ? "current active translation"
            : "click to make this translation active"
        }
        type="action"
      >
        {language.id === activeLanguageId ? (
          <span css={[tw`text-green-400`]}>
            <Check />
          </span>
        ) : (
          <button
            css={[
              tw`text-gray-400 p-xs opacity-0 group-hover:opacity-100 ease-in-out transition-opacity duration-75`,
            ]}
            onClick={() => {
              if (language.id === activeLanguageId) {
                return;
              }
              updateActiveLanguage(language.id);
            }}
            type="button"
          >
            <Check />
          </button>
        )}
      </WithTooltip>
    </div>
  );
};

export default Found;
