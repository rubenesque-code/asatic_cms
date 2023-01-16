import MyImage, { MyImageProps } from "^components/images/MyImage";
import ResizeImage, { ResizeImageProps } from "^components/resize/Image";
import { MyOmit } from "^types/utilities";

export const Image_ = ({
  myImageProps,
  resizeImageProps,
}: {
  resizeImageProps: MyOmit<ResizeImageProps, "children">;
  myImageProps: MyOmit<MyImageProps, "layout" | "objectFit">;
}) => {
  return (
    <ResizeImage {...resizeImageProps}>
      <MyImage objectFit="cover" {...myImageProps} />
    </ResizeImage>
  );
};
