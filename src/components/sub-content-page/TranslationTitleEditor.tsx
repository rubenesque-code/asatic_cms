import InlineTextEditor from "^components/editors/Inline";
import MissingText from "^components/MissingText";
import WithTooltip from "^components/WithTooltip";

const TranslationTitleEditor = ({
  injectedValue,
  onChange,
  id,
}: {
  injectedValue: string;
  onChange: (text: string) => void;
  id?: string;
}) => (
  <WithTooltip text="Edit translation" placement="bottom">
    <InlineTextEditor
      injectedValue={injectedValue}
      onUpdate={onChange}
      placeholder=""
      minWidth={0}
      id={id}
    >
      {({ isFocused: isEditing }) => (
        <>
          {!injectedValue.length && !isEditing ? (
            <MissingText tooltipText="missing translation" />
          ) : null}
        </>
      )}
    </InlineTextEditor>
  </WithTooltip>
);

export default TranslationTitleEditor;
