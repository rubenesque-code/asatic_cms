import { ReactElement } from "react";
import { CaretLeft, CaretRight } from "phosphor-react";
import tw from "twin.macro";

import { landingColorThemes } from "^data/landing";

import { LandingColorTheme } from "^types/landing";

import LandingSwiper from "^components/swipers/Landing";

export default function Swiper({
  colorTheme,
  elements,
}: {
  colorTheme: LandingColorTheme;
  elements: ReactElement[];
}) {
  return (
    <LandingSwiper
      elements={elements}
      navButtons={
        elements.length > 3
          ? ({ swipeLeft, swipeRight }) => (
              <div
                css={[
                  landingColorThemes[colorTheme].bg,
                  tw`z-20 absolute top-0 right-0 min-w-[110px] h-full bg-opacity-70 flex flex-col justify-center`,
                ]}
              >
                <div css={[tw`-translate-x-sm`]}>
                  <button
                    css={[
                      tw`p-xs bg-white opacity-60 hover:opacity-90 text-3xl`,
                    ]}
                    onClick={swipeLeft}
                    type="button"
                  >
                    <CaretLeft />
                  </button>
                  <button
                    css={[tw`p-xs bg-white text-3xl`]}
                    onClick={swipeRight}
                    type="button"
                  >
                    <CaretRight />
                  </button>
                </div>
              </div>
            )
          : null
      }
    />
  );
}

Swiper.Element = function SwiperElement({
  children,
}: {
  children: ReactElement;
}) {
  return <div css={[tw`p-sm`]}>{children}</div>;
};

// todo: abstraction for missing text
