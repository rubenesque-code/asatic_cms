import ArticleImageSectionSlice from "^context/articles/ArticleImageSectionContext";
import Empty from "./Empty";
import Populated from "./Populated";

export default function ImageSection() {
  const [
    {
      image: { imageId },
    },
  ] = ArticleImageSectionSlice.useContext();

  return imageId ? <Populated /> : <Empty />;
}
