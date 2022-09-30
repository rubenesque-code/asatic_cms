import tw, { styled } from "twin.macro";
import s_transition from "^styles/transition";

export const Container = styled.div(({ isShowing }: { isShowing: boolean }) => [
  tw`relative z-30 hover:z-50 h-[20px]`,
  s_transition.toggleVisiblity(isShowing),
  tw`opacity-30 hover:opacity-100 hover:visible`,
]);

export const ButtonsContainer = tw.div`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`;
