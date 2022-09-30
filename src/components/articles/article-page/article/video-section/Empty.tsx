import ArticleVideoSectionSlice from "^context/articles/ArticleVideoSectionContext";

import SectionMenuGeneric from "../SectionMenuGeneric";
import VideoSection from "^components/display-content/entity-page/article/VideoSection";

export default function Empty() {
  const [{ id: sectionId, index }, { updateBodyVideoSrc }] =
    ArticleVideoSectionSlice.useContext();

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
