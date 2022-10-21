import BlogVideoSectionSlice from "^context/blogs/BlogVideoSectionContext";

import Empty from "./Empty";
import Populated from "./Populated";

export default function ImageSection() {
  const [
    {
      video: { youtubeId },
    },
  ] = BlogVideoSectionSlice.useContext();

  return youtubeId ? <Populated /> : <Empty />;
}
