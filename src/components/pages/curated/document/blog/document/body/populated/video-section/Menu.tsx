import BlogVideoSectionSlice from "^context/blogs/BlogVideoSectionContext";

import { UpdateVideoSrcButton } from "^components/pages/curated/document/_containers/article-like";
import SectionMenu_ from "../_containers/SectionMenu_";

const Menu = ({ isShowing }: { isShowing: boolean }) => {
  const [{ id: sectionId, index: sectionIndex }, { updateBodyVideoSrc }] =
    BlogVideoSectionSlice.useContext();

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
