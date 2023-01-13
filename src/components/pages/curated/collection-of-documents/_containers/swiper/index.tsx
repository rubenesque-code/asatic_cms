import "swiper/css";

import { ReactElement, useState } from "react";
import { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { CaretLeft, CaretRight } from "phosphor-react";
import tw from "twin.macro";

import ContainerUtility from "^components/ContainerUtilities";

export const Swiper_ = ({ slides }: { slides: ReactElement[] }) => {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);

  const navButtonsFuncs = {
    swipeLeft: () => swiper?.slidePrev(),
    swipeRight: () => swiper?.slideNext(),
  };

  return (
    <ContainerUtility.Width>
      {(containerWidth) => {
        const numSlidesPerView = containerWidth > 900 ? 3 : 2;
        const navigationIsShowing = swiper && slides.length > numSlidesPerView;

        return (
          <Swiper
            spaceBetween={0}
            slidesPerView={numSlidesPerView}
            onSwiper={(swiper) => setSwiper(swiper)}
          >
            {slides.map((slide, i) => (
              // `SwiperSlide`, as it's imported from swiper/react, needs to be a direct child of `Swiper`; can't be within another component.
              <SwiperSlide key={i}>
                <div css={[tw`p-sm border-r h-full`]}>{slide}</div>
              </SwiperSlide>
            ))}
            {navigationIsShowing ? <Navigation_ {...navButtonsFuncs} /> : null}
          </Swiper>
        );
      }}
    </ContainerUtility.Width>
  );
};

const Navigation_ = ({
  swipeLeft,
  swipeRight,
}: {
  swipeLeft: () => void;
  swipeRight: () => void;
}) => {
  return (
    <div
      css={[
        tw`z-20 absolute top-0 right-0 min-w-[110px] h-full bg-opacity-70 flex flex-col justify-center`,
      ]}
    >
      <div css={[tw`-translate-x-sm`]}>
        <$NavButton
          css={[tw`opacity-60 hover:opacity-90`]}
          onClick={swipeLeft}
          type="button"
        >
          <CaretLeft />
        </$NavButton>
        <$NavButton onClick={swipeRight} type="button">
          <CaretRight />
        </$NavButton>
      </div>
    </div>
  );
};

const $NavButton = tw.button`p-xs bg-white text-3xl`;
