import { ArrowRight } from "phosphor-react";
import { ReactElement } from "react";
import tw from "twin.macro";

import { landingColorThemes } from "^data/landing";
import { LandingColorTheme } from "^types/landing";

import { LandingAutoSectionIcon } from "^components/Icons";

export function $Empty({ docType }: { docType: string }) {
  return (
    <div css={[tw`grid place-items-center min-h-[150px]`]}>
      <div css={[tw``]}>
        <div css={[tw`flex justify-center text-2xl text-gray-400`]}>
          <LandingAutoSectionIcon />
        </div>
        <p css={[tw`mt-sm text-gray-600 font-medium text-center`]}>
          No {docType}
        </p>
        <p css={[tw`mt-xxxs text-gray-placeholder font-medium text-center`]}>
          No {docType} have been created yet.
        </p>
      </div>
    </div>
  );
}
export function $Populated({
  colorTheme,
  moreFromText,
  swiper,
  title,
}: {
  colorTheme: LandingColorTheme;
  title: string;
  moreFromText: string;
  swiper: ReactElement;
}) {
  return (
    <div css={[tw`font-serif-eng`, landingColorThemes[colorTheme].bg]}>
      <div
        css={[
          landingColorThemes[colorTheme].text,
          tw`flex justify-between items-baseline border-b`,
        ]}
      >
        <h3 css={[tw`pl-xl pt-sm pb-xs text-2xl`]}>{title}</h3>
        <p css={[tw`flex items-center gap-xs text-lg mr-lg`]}>
          <span>{moreFromText}</span>
          <ArrowRight weight="bold" />
        </p>
      </div>
      <div css={[tw`ml-lg z-10 border-l`]}>{swiper} </div>
    </div>
  );
}
