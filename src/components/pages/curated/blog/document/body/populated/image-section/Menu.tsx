import BlogImageSectionSlice from "^context/blogs/BlogImageSectionContext";

import ContentMenu from "^components/menus/Content";
import {
  UpdateImageSrcButton_,
  UpdateImageVertPositionButtons_,
} from "../../../../../_containers/ImageMenu_";
import SectionMenu from "../_containers/SectionMenu_";

const Menu = ({
  isShowing,
  isImage,
}: {
  isShowing: boolean;
  isImage: boolean;
}) => {
  const [
    {
      id: sectionId,
      index: sectionIndex,
      image: { vertPosition },
    },
    { updateBodyImageSrc, updateBodyImageVertPosition },
  ] = BlogImageSectionSlice.useContext();

  return (
    <SectionMenu
      isShowing={isShowing}
      sectionId={sectionId}
      sectionIndex={sectionIndex}
    >
      <UpdateImageSrcButton_
        updateImageSrc={(imageId) => updateBodyImageSrc({ imageId })}
      />
      {isImage ? (
        <>
          <ContentMenu.VerticalBar />
          <UpdateImageVertPositionButtons_
            updateVertPosition={(vertPosition) =>
              updateBodyImageVertPosition({ vertPosition })
            }
            vertPosition={vertPosition || 50}
          />
        </>
      ) : null}
    </SectionMenu>
  );
};

export default Menu;
