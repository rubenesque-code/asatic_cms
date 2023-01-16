import { PlusCircle } from "phosphor-react";
import { ReactElement } from "react";
import tw from "twin.macro";

import ContentMenu from "^components/menus/Content";

import s_transition from "^styles/transition";

export const $DocumentBodyAddSectionMenu_ = ({
  isShowing,
  children: addSectionPopover,
}: {
  children: (button: ReactElement) => ReactElement;
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
        {addSectionPopover(<$AddSectionButton_ />)}
      </div>
    </div>
  );
};

function $AddSectionButton_() {
  return (
    <ContentMenu.Button
      tooltipProps={{ text: "add a text, image or video section" }}
    >
      <PlusCircle />
    </ContentMenu.Button>
  );
}
