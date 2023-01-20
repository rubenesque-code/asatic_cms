import BlogVideoSectionSlice from "^context/blogs/BlogVideoSectionContext";

import { $MediaSectionContainer_ } from "^components/pages/curated/document/_presentation/article-like";
import { Caption_ } from "^components/pages/curated/document/_containers/article-like";
import { Video_ } from "^document-pages/_containers/Video_";
import Menu from "./Menu";

const Populated = () => {
  return (
    <$MediaSectionContainer_
      menu={(containerIsHovered) => <Menu isShowing={containerIsHovered} />}
    >
      <Video />
      <Caption />
    </$MediaSectionContainer_>
  );
};

export default Populated;

const Video = () => {
  const [{ youtubeId }] = BlogVideoSectionSlice.useContext();

  return <Video_ youtubeId={youtubeId!} />;
};

const Caption = () => {
  const [{ caption }, { updateBodyVideoCaption }] =
    BlogVideoSectionSlice.useContext();

  return (
    <Caption_
      caption={caption}
      updateCaption={(caption) => updateBodyVideoCaption({ caption })}
    />
  );
};
