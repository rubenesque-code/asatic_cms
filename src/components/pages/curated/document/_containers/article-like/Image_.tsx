import MyImage, { MyImageProps } from "^components/images/MyImage";
import { MyOmit } from "^types/utilities";

export const Image_ = ({
  myImageProps,
}: {
  myImageProps: MyOmit<MyImageProps, "layout" | "objectFit">;
}) => <MyImage objectFit="cover" {...myImageProps} />;
