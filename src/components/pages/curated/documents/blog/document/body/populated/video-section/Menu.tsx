import ArticleVideoSectionSlice from "^context/articles/ArticleVideoSectionContext";

import { UpdateVideoSrcButton } from "^curated-pages/_containers/article-like";
import SectionMenu_ from "../_containers/SectionMenu_";

const Menu = ({ isShowing }: { isShowing: boolean }) => {
  const [{ id: sectionId, index: sectionIndex }, { updateBodyVideoSrc }] =
    ArticleVideoSectionSlice.useContext();

  return (
    <SectionMenu_
      isShowing={isShowing}
      sectionId={sectionId}
      sectionIndex={sectionIndex}
    >
      <UpdateVideoSrcButton
        updateVideoSrc={(youtubeId) => updateBodyVideoSrc({ youtubeId })}
      />
    </SectionMenu_>
  );
};

export default Menu;
