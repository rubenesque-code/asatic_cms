import BlogImageSectionSlice from "^context/blogs/BlogImageSectionContext";

import ImageSection from "^components/article-like/entity-page/article/ImageSection";
import SectionMenuGeneric from "../SectionMenuGeneric";

export default function Empty() {
  const [{ id: sectionId, index }, { updateBodyImageSrc }] =
    BlogImageSectionSlice.useContext();

  return (
    <ImageSection.Empty
      updateImageSrc={(imageId) => updateBodyImageSrc({ imageId })}
    >
      {(isHovered) => (
        <>
          <SectionMenuGeneric
            isShowing={isHovered}
            sectionId={sectionId}
            sectionIndex={index}
          />
        </>
      )}
    </ImageSection.Empty>
  );
}
