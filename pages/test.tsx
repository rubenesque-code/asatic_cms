import { NextPage } from "next";
import tw from "twin.macro";
import Header from "^components/header";
import { useFetchImagesQuery } from "^redux/services/images";

const test: NextPage = () => {
  return (
    <div>
      <UploadedImagesPanel />
    </div>
  );
};

export default test;

const UploadedImagesPanel = () => {
  const { data: images, isLoading } = useFetchImagesQuery();

  if (isLoading) {
    return <div css={[tw`p-lg bg-white`]}>Loading images...</div>;
  }

  return (
    <div css={[tw`absolute p-lg bg-white w-3/4 border-2`]}>
      {images!.length ? (
        <div css={[tw`grid grid-cols-4 gap-sm`]}>
          {[1, 2, 3, 4, 5].map((image) => (
            // {images!.map((image) => (
            <div
              css={[tw`relative border aspect-ratio[4/3]`]}
              // css={[tw`relative border w-[200px] aspect-ratio[4/3]`]}
              key={image}
              // key={image.id}
            >
              {/* <NextImage src={image.URL} layout="fill" objectFit="contain" /> */}
            </div>
          ))}
        </div>
      ) : (
        <p>No images yet</p>
      )}
    </div>
  );
};
