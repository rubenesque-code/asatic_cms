import tw, { css } from "twin.macro";

const s_transition = {
  toggleVisiblity: (isVisible: boolean) =>
    css`
      ${isVisible ? tw`visible opacity-100` : tw`invisible opacity-0`}
      ${tw`transition-opacity ease-in-out duration-75`}
    `,
  onGroupHover: tw`opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity ease-in-out duration-75`,
};

export default s_transition;
