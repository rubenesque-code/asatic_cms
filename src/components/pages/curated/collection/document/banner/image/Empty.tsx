import tw from "twin.macro";
import { ImageIcon } from "^components/Icons";

const Empty = () => {
  return (
    <div css={[tw`relative bg-gray-50 h-full`]}>
      <div
        css={tw`absolute top-md right-lg bottom-md h-full grid place-items-center`}
      >
        <div css={[tw`flex flex-col items-center`]}>
          <span css={[tw`text-2xl text-gray-400`]}>
            <ImageIcon weight="thin" />
          </span>
          <p css={[tw`text-gray-700 text-sm mt-sm text-center px-sm`]}>
            No banner image.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Empty;
