import ArticleVideoSectionSlice from "^context/articles/ArticleVideoSectionContext";

import { VideoSectionMenu_ } from "../../../../../_containers/article-like";

const Menu = ({ isShowing }: { isShowing: boolean }) => {
  const [{ id: sectionId, index: sectionIndex }, { updateBodyVideoSrc }] =
    ArticleVideoSectionSlice.useContext();

  return (
    <VideoSectionMenu_
      isShowing={isShowing}
      sectionId={sectionId}
      sectionIndex={sectionIndex}
      updateVideoSrc={(youtubeId) => updateBodyVideoSrc({ youtubeId })}
    />
  );
};

export default Menu;
