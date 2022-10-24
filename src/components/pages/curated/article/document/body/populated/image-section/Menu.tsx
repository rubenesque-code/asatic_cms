import ArticleImageSectionSlice from "^context/articles/ArticleImageSectionContext";

import ContentMenu from "^components/menus/Content";
import {
  UpdateImageSrcButton,
  UpdateImageVertPositionButtons,
} from "../../../../../_containers/article-like";
import SectionMenu_ from "../_containers/SectionMenu_";

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
      image: {
        style: { vertPosition },
      },
    },
    { updateBodyImageSrc, updateBodyImageVertPosition },
  ] = ArticleImageSectionSlice.useContext();

  return (
    <SectionMenu_
      isShowing={isShowing}
      sectionId={sectionId}
      sectionIndex={sectionIndex}
    >
      <UpdateImageSrcButton
        updateImageSrc={(imageId) => updateBodyImageSrc({ imageId })}
      />
      {isImage ? (
        <>
          <ContentMenu.VerticalBar />
          <UpdateImageVertPositionButtons
            updateVertPosition={(vertPosition) =>
              updateBodyImageVertPosition({ vertPosition })
            }
            vertPosition={vertPosition}
          />
        </>
      ) : null}
    </SectionMenu_>
  );
};

export default Menu;
