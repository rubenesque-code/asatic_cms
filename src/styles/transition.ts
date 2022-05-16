import tw from "twin.macro";

const s_transition = {
  toggleVisiblity: (isVisible: boolean) =>
    isVisible ? tw`visible opacity-100` : tw`invisible opacity-0`,
};

export default s_transition;
