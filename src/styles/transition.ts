import tw from "twin.macro";

const s_transition = {
  toggleVisiblity: (isVisible: boolean) =>
    isVisible ? tw`visible opacity-100` : tw`invisible opacity-0`,
  groupHoverChildVisibility: tw`opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity ease-in-out duration-75`,
};

export default s_transition;
