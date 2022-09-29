import tw from "twin.macro";
import { PlusCircle } from "phosphor-react";

import ContentMenu from "^components/menus/Content";

import s_transition from "^styles/transition";
import { ReactElement } from "react";

const AddSectionMenu = ({
  children: addSectionPopover,
  isShowing,
}: {
  children: ReactElement;
  isShowing: boolean;
}) => {
  return (
    <div
      css={[
        tw`relative z-30 hover:z-50 h-[20px]`,
        s_transition.toggleVisiblity(isShowing),
        tw`opacity-30 hover:opacity-100 hover:visible`,
      ]}
    >
      <div
        css={[tw`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`]}
      >
        {addSectionPopover}
      </div>
    </div>
  );
};

export default AddSectionMenu;

export const AddSectionButton = () => {
  return (
    <ContentMenu.Button
      tooltipProps={{ text: "add a text, image or video section" }}
    >
      <PlusCircle />
    </ContentMenu.Button>
  );
};
