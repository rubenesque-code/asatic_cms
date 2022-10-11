import "swiper/css";

import { ReactElement, useState } from "react";
import { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { CaretLeft, CaretRight } from "phosphor-react";
import tw from "twin.macro";

import { landingColorThemes } from "^data/landing";

import { LandingColorTheme } from "^types/landing";
import ContainerUtility from "^components/ContainerUtilities";

export default function Swiper_({
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

const LandingSwiper = ({
  elements,
  navButtons,
}: {
  elements: ReactElement[];
  navButtons?:
    | (({
        swipeLeft,
        swipeRight,
      }: {
        swipeLeft: () => void;
        swipeRight: () => void;
      }) => ReactElement)
    | null;
}) => {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);

  const swipeLeft = () => swiper?.slidePrev();
  const swipeRight = () => swiper?.slideNext();

  return (
    <ContainerUtility.Width>
      {(width) => (
        <Swiper
          spaceBetween={0}
          slidesPerView={width > 900 ? 3 : 2}
          onSwiper={(swiper) => setSwiper(swiper)}
        >
          {elements.map((element, i) => (
            <SwiperSlide key={i}>{element}</SwiperSlide>
          ))}
          {navButtons && swiper ? navButtons({ swipeLeft, swipeRight }) : null}
        </Swiper>
      )}
    </ContainerUtility.Width>
  );
};
