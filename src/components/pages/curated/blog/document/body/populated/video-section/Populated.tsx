import BlogVideoSectionSlice from "^context/blogs/BlogVideoSectionContext";

import { $MediaSectionContainer_ } from "../../../../../_presentation/article-like";
import { Video_, Caption_ } from "../../../../../_containers/article-like";
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
  const [
    {
      video: { youtubeId },
    },
  ] = BlogVideoSectionSlice.useContext();

  return <Video_ youtubeId={youtubeId!} />;
};

const Caption = () => {
  const [
    {
      video: { caption },
    },
    { updateBodyVideoCaption },
  ] = BlogVideoSectionSlice.useContext();

  return (
    <Caption_
      caption={caption}
      updateCaption={(caption) => updateBodyVideoCaption({ caption })}
    />
  );
};
