import BlogVideoSectionSlice from "^context/blogs/BlogVideoSectionContext";

import { UpdateVideoSrcButton } from "../../../../../_containers/article-like";
import SectionMenu from "../_containers/SectionMenu_";

const Menu = ({ isShowing }: { isShowing: boolean }) => {
  const [{ id: sectionId, index: sectionIndex }, { updateBodyVideoSrc }] =
    BlogVideoSectionSlice.useContext();

  return (
    <SectionMenu
      isShowing={isShowing}
      sectionId={sectionId}
      sectionIndex={sectionIndex}
    >
      <UpdateVideoSrcButton
        updateVideoSrc={(youtubeId) => updateBodyVideoSrc({ youtubeId })}
      />
    </SectionMenu>
  );
};

export default Menu;
