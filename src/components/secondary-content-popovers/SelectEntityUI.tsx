import { FilePlus } from "phosphor-react";
import { ReactElement } from "react";
import tw from "twin.macro";
import WithTooltip from "^components/WithTooltip";
import s_transition from "^styles/transition";

export default function SelectEntityUI({
  addToDoc,
  canAddToDoc,
  children: translations,
}: {
  addToDoc: () => void;
  canAddToDoc: boolean;
  children: ReactElement[] | ReactElement;
}) {
  return (
    <WithTooltip text="add to document" type="action" isDisabled={!canAddToDoc}>
      <button
        css={[
          tw`text-left py-1 relative w-full px-sm`,
          !canAddToDoc && tw`pointer-events-none`,
        ]}
        className="group"
        onClick={addToDoc}
        type="button"
      >
        <span
          css={[
            tw`text-gray-600 group-hover:text-gray-800 w-full flex gap-sm`,
            !canAddToDoc && tw`text-gray-400`,
          ]}
        >
          {translations}
        </span>
        {canAddToDoc ? (
          <span
            css={[
              s_transition.onGroupHover,
              tw`group-hover:z-50 bg-white absolute right-2 top-1/2 -translate-y-1/2 text-green-600`,
            ]}
          >
            <FilePlus weight="bold" />
          </span>
        ) : null}
      </button>
    </WithTooltip>
  );
}

SelectEntityUI.Translation = function Translation({
  id,
  index,
  text,
}: {
  id: string;
  text: string;
  index: number;
}) {
  return (
    <div css={[tw`flex items-center gap-xs`]} key={id}>
      {index > 0 ? <span css={[tw`w-[0.5px] h-[15px] bg-gray-200`]} /> : null}
      <p>{text}</p>
    </div>
  );
};
