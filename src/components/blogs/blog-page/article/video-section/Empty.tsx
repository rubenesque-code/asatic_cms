import BlogVideoSectionSlice from "^context/blogs/BlogVideoSectionContext";

import SectionMenuGeneric from "../SectionMenuGeneric";
import VideoSection from "^components/display-entity/entity-page/article/VideoSection";

export default function Empty() {
  const [{ id: sectionId, index }, { updateBodyVideoSrc }] =
    BlogVideoSectionSlice.useContext();

  return (
    <VideoSection.Empty
      updateVideoSrc={(youtubeId) => updateBodyVideoSrc({ youtubeId })}
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
    </VideoSection.Empty>
  );
}
