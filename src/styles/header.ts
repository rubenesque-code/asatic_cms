import tw, { css } from "twin.macro";

import s_button from "./button";

export const s_header = {
  /** justify between */
  container: tw`flex items-center justify-between px-xs py-xxs`,
  button: css`
    ${s_button.icon} ${s_button.selectors}
  `,
  spacing: tw`flex items-center gap-sm`,
  verticalBar: tw`w-[0.5px] h-[22px] bg-gray-200`,
};
