import { SwiperElement_ } from "../../_containers/Swiper";
import ArticleSummary from "./ArticleSummary";

const SwiperElement = () => {
  return (
    <SwiperElement_>
      {(isHovered) => (
        <>
          <ArticleSummary />
        </>
      )}
    </SwiperElement_>
  );
};

export default SwiperElement;
