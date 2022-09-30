import BlogImageSectionSlice from "^context/blogs/BlogImageSectionContext";
import Empty from "./Empty";
import Populated from "./Populated";

export default function ImageSection() {
  const [
    {
      image: { imageId },
    },
  ] = BlogImageSectionSlice.useContext();

  return imageId ? <Populated /> : <Empty />;
}
