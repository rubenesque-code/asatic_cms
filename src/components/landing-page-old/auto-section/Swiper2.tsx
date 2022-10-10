import "swiper/css";

import { ReactElement, useState } from "react";
import { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import tw from "twin.macro";
import { CaretLeft, CaretRight } from "phosphor-react";

// todo: change key

const AutoSectionSwiper = ({ elements }: { elements: ReactElement[] }) => {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);

  const swipeLeft = () => swiper?.slidePrev();
  const swipeRight = () => swiper?.slideNext();

  return (
    <Swiper
      spaceBetween={0}
      slidesPerView={3}
      onSwiper={(swiper) => setSwiper(swiper)}
    >
      {elements.map((element, i) => (
        <SwiperSlide key={i}>{element}</SwiperSlide>
      ))}
      {swiper && elements.length > 3 ? (
        <ButtonsOverlay swipeLeft={swipeLeft} swipeRight={swipeRight} />
      ) : null}
    </Swiper>
  );
};

export default AutoSectionSwiper;

const ButtonsOverlay = ({
  swipeLeft,
  swipeRight,
}: {
  swipeLeft: () => void;
  swipeRight: () => void;
}) => (
  <div
    css={[
      tw`bg-white bg-opacity-40`,
      tw`z-20 absolute top-0 right-0 min-w-[110px] h-full bg-opacity-70 flex flex-col justify-center`,
    ]}
  >
    <div css={[tw`-translate-x-sm`]}>
      <LeftButton onClick={swipeLeft} />
      <RightButton onClick={swipeRight} />
    </div>
  </div>
);

const LeftButton = ({ onClick }: { onClick: () => void }) => (
  <button
    css={[tw`p-xs bg-white opacity-60 hover:opacity-90 text-3xl`]}
    onClick={onClick}
    type="button"
  >
    <CaretLeft />
  </button>
);

const RightButton = ({ onClick }: { onClick: () => void }) => (
  <button css={[tw`p-xs bg-white text-3xl`]} onClick={onClick} type="button">
    <CaretRight />
  </button>
);
