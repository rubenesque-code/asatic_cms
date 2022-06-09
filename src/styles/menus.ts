import tw, { css } from "twin.macro";
import s_button from "./button";

export const s_editorMenu = {
  menu: tw`px-sm py-xs flex items-center gap-xs bg-white rounded-md border-2 border-black`,
  button: {
    button: css`
      ${s_button.icon} ${s_button.selectors} ${tw`text-base p-xxs`}
    `,
    disabled: tw`cursor-auto text-gray-disabled`,
    isActive: tw`bg-gray-400 text-white hover:bg-gray-500 active:bg-gray-600`,
  },
};

export const s_menu = {
  listItemText: tw`text-gray-600 hover:text-gray-800 `,
};
