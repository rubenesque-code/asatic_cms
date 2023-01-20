import tw from "twin.macro";
import MyImage, { MyImageProps } from "^components/images/MyImage";
// import ResizeImage, { ResizeImageProps } from "^components/resize/Image";
import { MyOmit } from "^types/utilities";

export const Image_ = ({
  myImageProps,
}: {
  myImageProps: MyOmit<MyImageProps, "layout" | "objectFit">;
}) => {
  return (
    // <ResizeImage {...resizeImageProps}>
    <div css={[tw`relative aspect-ratio[16/9] overflow-hidden`]}>
      <MyImage objectFit="cover" {...myImageProps} />
    </div>
    // </ResizeImage>
  );
};
