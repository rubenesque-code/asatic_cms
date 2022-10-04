import tw from "twin.macro";
import { CaretDown, Image as ImageIcon, Plus } from "phosphor-react";

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
  const [, { updateImageSrc }] = CollectionSlice.useContext();

  return (
    <div
      css={[
        tw`absolute top-md right-lg bottom-md h-full grid place-items-center`,
      ]}
    >
      <div css={[tw`p-lg rounded-md text-sm`]}>
        <div css={[tw`mt-md`]}>
          <WithAddDocImage
            onAddImage={(imageId) => updateImageSrc({ imageId })}
          >
            <AddImageButton />
          </WithAddDocImage>
        </div>
      </div>
    </div>
  );
};

const AddImageButton = () => {
  return (
    <div css={[tw`flex items-center gap-xs cursor-pointer`]}>
      <div css={[tw`relative text-gray-300`]}>
        <span css={[tw`text-2xl`]}>
          <ImageIcon />
        </span>
        <span css={[tw`absolute -bottom-0.5 -right-1 bg-gray-50`]}>
          <Plus />
        </span>
      </div>
      <p css={[tw`text-gray-600 text-sm`]}>Add image</p>
      <span css={[tw`text-xs text-gray-600 grid place-items-center`]}>
        <CaretDown />
      </span>
    </div>
  );
};
