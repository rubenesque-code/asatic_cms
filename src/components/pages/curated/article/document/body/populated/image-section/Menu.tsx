import ContentMenu from "^components/menus/Content";
import ArticleImageSectionSlice from "^context/articles/ArticleImageSectionContext";

import {
  UpdateImageSrcButton,
  UpdateImageVertPositionButtons,
} from "../../../../../_containers/article-like";
import SectionMenu from "../SectionMenu";

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
    <SectionMenu
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
    </SectionMenu>
  );
};

export default Menu;
