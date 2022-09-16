import { ReactElement } from "react";
import tw from "twin.macro";

function PanelEntityUI({
  children: translations,
  menu,
}: {
  children: ReactElement;
  menu: ReactElement;
}) {
  return (
    <div css={[tw`flex gap-sm`]} className="group">
      <div
        css={[
          tw`opacity-0 group-hover:opacity-100 transition-opacity duration-150 ease-in delay-300`,
        ]}
      >
        {menu}
      </div>
      <div
        css={[
          tw`translate-x-[-40px] group-hover:z-40 group-hover:translate-x-0 transition-transform duration-150 ease-in delay-300`,
        ]}
      >
        {translations}
      </div>
    </div>
  );
}

export default PanelEntityUI;
