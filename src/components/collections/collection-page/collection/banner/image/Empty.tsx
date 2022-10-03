import tw from "twin.macro";
import CollectionSlice from "^context/collections/CollectionContext";
import MediaSection from "^components/display-content/entity-page/article/MediaSection";
import { CaretDown, Image as ImageIcon } from "phosphor-react";
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
        tw`absolute top-md right-xl bottom-md h-full grid place-items-center`,
      ]}
    >
      <div css={[tw`bg-white p-lg rounded-md`]}>
        <p css={tw`text-gray-800`}>No background image.</p>
        <div css={[tw`mt-md`]}>
          <WithAddDocImage
            onAddImage={(imageId) => updateImageSrc({ imageId })}
          >
            <div css={[tw`flex items-center gap-xs`]}>
              <MediaSection.Empty.AddContentButton text="Add image">
                <ImageIcon />
              </MediaSection.Empty.AddContentButton>
              <span css={[tw`text-sm text-gray-600`]}>
                <CaretDown />
              </span>
            </div>
          </WithAddDocImage>
        </div>
      </div>
    </div>
  );
};
