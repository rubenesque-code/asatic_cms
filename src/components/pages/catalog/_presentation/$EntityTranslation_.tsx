import tw from "twin.macro";

import InlineTextEditor from "^components/editors/Inline";
import { DeleteEntityIcon } from "^components/Icons";
import WithWarning from "^components/WithWarning";
import WithTooltip from "^components/WithTooltip";
import { Translation_ } from "^catalog-pages/_containers";

export const $TranslationText = tw.div`text-gray-700 mr-xs whitespace-nowrap font-serif-eng`;

export const $EntityTranslation_ = ({
  canDelete,
  languageId,
  text,
  updateText,
  remove,
}: {
  canDelete: boolean;
  languageId: string;
  text: string | undefined;
  updateText: (text: string) => void;
  remove: () => void;
}) => {
  return (
    <div css={[tw`flex items-center gap-xs`]}>
      <Translation_ languageId={languageId} type="active">
        <$TranslationText>
          <InlineTextEditor
            injectedValue={text || ""}
            onUpdate={updateText}
            placeholder="translation..."
          />
        </$TranslationText>
      </Translation_>
      {!canDelete ? null : (
        <DeleteTranslationButton removeTranslation={remove} />
      )}
    </div>
  );
};

const DeleteTranslationButton = ({
  removeTranslation,
}: {
  removeTranslation: () => void;
}) => {
  return (
    <WithWarning
      callbackToConfirm={removeTranslation}
      warningText={{
        heading: "Delete translation?",
        body: "This translation is unused and can safely be deleted.",
      }}
    >
      <WithTooltip
        text={{
          header: "Delete translation",
          body: "This translation is unused and can safely be deleted.",
        }}
      >
        <button
          css={[
            tw`text-gray-200 text-sm hover:text-red-warning transition-colors ease-in-out`,
          ]}
          type="button"
        >
          <DeleteEntityIcon />
        </button>
      </WithTooltip>
    </WithWarning>
  );
};
