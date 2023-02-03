import { PlusCircle } from "phosphor-react";
import { ReactElement } from "react";
import tw from "twin.macro";

import ContentMenu from "^components/menus/Content";

export const $DocumentBodyAddSectionMenu_ = ({
  containerIsHovered,
  children: addSectionPopover,
}: {
  children: (button: ReactElement) => ReactElement;
  containerIsHovered: boolean;
}) => {
  return (
    <div
      css={[
        tw`relative z-30 hover:z-50 h-[20px]`,
        !containerIsHovered ? tw`opacity-0` : tw`opacity-30`,
        tw`hover:opacity-100 hover:visible`,
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
