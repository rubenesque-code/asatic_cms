import ArticleImageSectionSlice from "^context/articles/ArticleImageSectionContext";
import {
  $MediaSectionContainer_,
  $MediaSectionEmpty_,
} from "../../../../../_presentation/article-like";
import { ImageSectionEmptyMenu_ } from "../../../../../_containers/article-like";

const Empty = () => {
  const [{ id: sectionId, index: sectionIndex }, { updateBodyImageSrc }] =
    ArticleImageSectionSlice.useContext();

  return (
    <$MediaSectionContainer_
      menu={(containerIsHovered) => (
        <ImageSectionEmptyMenu_
          isShowing={containerIsHovered}
          sectionId={sectionId}
          sectionIndex={sectionIndex}
          updateImageSrc={(imageId) => updateBodyImageSrc({ imageId })}
        />
      )}
    >
      <$MediaSectionEmpty_ mediaType="image" />
    </$MediaSectionContainer_>
  );
};

export default Empty;
