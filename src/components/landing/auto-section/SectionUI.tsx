import { ArrowRight } from "phosphor-react";
import { ReactElement } from "react";
import tw from "twin.macro";

import { landingColorThemes } from "^data/landing";
import { LandingColorTheme } from "^types/landing";

const AutoSectionUI = ({
  colorTheme,
  moreFromText,
  swiper,
  title,
}: {
  colorTheme: LandingColorTheme;
  title: string;
  moreFromText: string;
  swiper: ReactElement;
}) => (
  <div css={[tw`font-serif-eng`, landingColorThemes[colorTheme].bg]}>
    <div
      css={[
        landingColorThemes[colorTheme].text,
        tw`flex items-center justify-between`,
      ]}
    >
      <h3 css={[tw`pl-xl pt-sm pb-xs text-2xl border-b`]}>{title}</h3>
      <p css={[tw`flex items-center gap-xs text-lg mr-lg`]}>
        <span>{moreFromText}</span>
        <ArrowRight weight="bold" />
      </p>
    </div>
    <div css={[tw`ml-lg z-10 border-l`]}>{swiper} </div>
  </div>
);

export default AutoSectionUI;
