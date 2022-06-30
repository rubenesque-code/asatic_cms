import { Plus } from "phosphor-react";
import { ReactElement } from "react";
import tw from "twin.macro";

const AddItemButton = ({ children }: { children: ReactElement | string }) => {
  return (
    <button
      css={[
        tw`cursor-pointer flex items-center gap-sm py-1 px-2 border-2 rounded-sm text-blue-500 border-blue-500`,
      ]}
      type="button"
    >
      <span css={[tw`text-xs uppercase font-medium`]}>{children}</span>
      <span css={[tw`text-blue-400`]}>
        <Plus weight="bold" />
      </span>
    </button>
  );
};

export default AddItemButton;
