import { ReactElement } from "react";
import tw from "twin.macro";
import s_transition from "^styles/transition";

const ContentMenuUI = ({
  children,
}: {
  children: ReactElement | ReactElement[];
}) => (
  <menu css={[s_transition.onGroupHover, tw`flex items-center gap-sm`]}>
    {children}
  </menu>
);

export default ContentMenuUI;
