import ArticleImageSectionSlice from "^context/articles/ArticleImageSectionContext";
import {
  $ImageSectionContainer_,
  $ImageSectionEmpty_,
} from "../../../../../_presentation/article-like";
import { ImageSectionEmptyMenu_ } from "../../../../../_containers/article-like";

const Empty = () => {
  const [{ id: sectionId, index: sectionIndex }, { updateBodyImageSrc }] =
    ArticleImageSectionSlice.useContext();

  return (
    <$ImageSectionContainer_
      menu={(containerIsHovered) => (
        <ImageSectionEmptyMenu_
          isShowing={containerIsHovered}
          sectionId={sectionId}
          sectionIndex={sectionIndex}
          updateImageSrc={(imageId) => updateBodyImageSrc({ imageId })}
        />
      )}
    >
      <$ImageSectionEmpty_ />
    </$ImageSectionContainer_>
  );
};

export default Empty;
