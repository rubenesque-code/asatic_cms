import { ReactElement } from "react";
import tw from "twin.macro";
import s_transition from "^styles/transition";
import { HoverHandlers } from "^types/props";

const AddSectionMenuUI = ({
  show,
  addSectionButton,
  ...hoverHandlers
}: {
  show: boolean;
  addSectionButton: ReactElement;
} & HoverHandlers) => (
  <div
    css={[
      tw`relative z-30 hover:z-40 h-[10px]`,
      s_transition.toggleVisiblity(show),
      tw`opacity-40 hover:opacity-100`,
    ]}
    {...hoverHandlers}
  >
    <div
      css={[tw`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`]}
    >
      {addSectionButton}
    </div>
  </div>
);

export default AddSectionMenuUI;
