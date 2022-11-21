import tw from "twin.macro";
import { Collection } from "^types/collection";
import Swiper from "./swiper";

const Collections = ({ collections }: { collections: Collection[] }) => {
  return (
    <div>
      <div
        css={[
          tw`text-3xl font-serif-eng text-gray-700 mb-sm border-b pl-xs pb-sm pt-md border-t`,
        ]}
      >
        Collections
      </div>
      <Swiper collections={collections} />
    </div>
  );
};

export default Collections;
