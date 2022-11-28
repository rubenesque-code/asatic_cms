import tw from "twin.macro";

import InlineTextEditor from "^components/editors/Inline";
import AuthorSlice from "^context/authors/AuthorContext";

import { AuthorTranslation } from "^types/author";

import { Translation_ } from "^catalog-pages/_containers";
import { useIsAuthorTranslationUsed } from "^hooks/authors/useIsAuthorTranslationUsed";
import { DeleteEntityIcon } from "^components/Icons";
import WithWarning from "^components/WithWarning";
import WithTooltip from "^components/WithTooltip";

export const $TranslationText = tw.div`text-gray-700 mr-xs whitespace-nowrap font-serif-eng`;

const Translation = ({ translation }: { translation: AuthorTranslation }) => {
  const [{ translations }, { updateName }] = AuthorSlice.useContext();

  const authorTranslationIsUsed = useIsAuthorTranslationUsed(translation);

  const canDeleteTranslation =
    !authorTranslationIsUsed && translations.length > 1;

  return (
    <div css={[tw`flex items-center gap-xs`]}>
      <Translation_ languageId={translation.languageId} type="active">
        <$TranslationText>
          <InlineTextEditor
            injectedValue={translation?.name || ""}
            onUpdate={(name) =>
              updateName({ name, translationId: translation.id })
            }
            placeholder="translation..."
          />
        </$TranslationText>
      </Translation_>
      {!canDeleteTranslation ? null : (
        <DeleteTranslationButton translationId={translation.id} />
      )}
    </div>
  );
};

export default Translation;

const DeleteTranslationButton = ({
  translationId,
}: {
  translationId: string;
}) => {
  const [, { removeTranslation }] = AuthorSlice.useContext();

  return (
    <WithWarning
      callbackToConfirm={() => removeTranslation({ translationId })}
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
