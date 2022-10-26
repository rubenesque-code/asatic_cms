import { FilePlus } from "phosphor-react";
import tw from "twin.macro";

export const $CreateEntityButton_ = ({
  onClick,
  entityType: docType,
}: {
  onClick: () => void;
  entityType: string;
}) => (
  <button
    onClick={onClick}
    css={[
      tw`flex items-center gap-8 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 duration-75 active:translate-y-0.5 active:translate-x-0.5 transition-all ease-in-out text-white rounded-md py-2 px-4`,
    ]}
    type="button"
  >
    <span css={[tw`font-medium uppercase text-sm`]}>Create {docType}</span>
    <span>
      <FilePlus />
    </span>
  </button>
);
