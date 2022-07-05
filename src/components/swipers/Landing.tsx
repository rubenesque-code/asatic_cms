import "swiper/css";

import { ReactElement, useState } from "react";
import { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

// todo: change key

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
    <Swiper
      spaceBetween={0}
      slidesPerView={3}
      onSwiper={(swiper) => setSwiper(swiper)}
    >
      {elements.map((element, i) => (
        <SwiperSlide key={i}>{element}</SwiperSlide>
      ))}
      {navButtons && swiper ? navButtons({ swipeLeft, swipeRight }) : null}
    </Swiper>
  );
};

export default LandingSwiper;
