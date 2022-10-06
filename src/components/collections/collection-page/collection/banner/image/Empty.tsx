import tw from "twin.macro";
import { Image as ImageIcon, Plus } from "phosphor-react";

import CollectionSlice from "^context/collections/CollectionContext";

import WithAddDocImage from "^components/WithAddDocImage";

const Empty = () => {
  return (
    <div css={[tw`relative bg-gray-50 h-full`]}>
      <AddImageCard />
    </div>
  );
};

export default Empty;

const AddImageCard = () => {
  const [, { updateBannerImageSrc }] = CollectionSlice.useContext();

  return (
    <div
      css={[
        tw`absolute top-md right-lg bottom-md h-full grid place-items-center`,
      ]}
    >
      <div css={[tw`p-lg rounded-md text-sm`]}>
        <WithAddDocImage
          onAddImage={(imageId) => updateBannerImageSrc({ imageId })}
        >
          <AddImageButton />
        </WithAddDocImage>
      </div>
    </div>
  );
};

const AddImageButton = () => {
  return (
    <div
      css={[
        tw`flex flex-col items-center gap-xs cursor-pointer text-gray-100 p-md`,
      ]}
    >
      <div css={[tw`relative text-gray-300`]}>
        <div css={[tw`text-4xl`]}>
          <ImageIcon />
        </div>
        <span css={[tw`absolute -bottom-0.5 -right-1 bg-gray-50 rounded-full`]}>
          <Plus />
        </span>
      </div>
      <p css={[tw`text-gray-500 text-base`]}>Add banner image</p>
    </div>
  );
};
