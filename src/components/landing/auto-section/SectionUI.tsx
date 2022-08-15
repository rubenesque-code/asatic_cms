import { ReactElement } from "react";
import tw from "twin.macro";

import { landingColorThemes } from "^data/landing";
import { LandingColorTheme } from "^types/landing";

const AutoSectionUI = ({
  colorTheme,
  swiper,
  title,
}: {
  colorTheme: LandingColorTheme;
  title: string;
  swiper: ReactElement;
}) => (
  <div css={[tw`font-serif-eng`, landingColorThemes[colorTheme].bg]}>
    <h3
      css={[
        tw`pl-xl pt-sm pb-xs text-2xl border-b`,
        landingColorThemes[colorTheme].text,
      ]}
    >
      {title}
    </h3>
    <div css={[tw`ml-lg z-10 border-l`]}>{swiper} </div>
  </div>
);

export default AutoSectionUI;
