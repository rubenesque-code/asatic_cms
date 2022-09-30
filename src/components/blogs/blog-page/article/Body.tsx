import BlogSlice from "^context/blogs/BlogContext";
import BlogTranslationSlice from "^context/blogs/BlogTranslationContext";
import BlogImageSectionSlice from "^context/blogs/BlogImageSectionContext";
import BlogTextSectionSlice from "^context/blogs/BlogTextSectionContext";
import BlogVideoSectionSlice from "^context/blogs/BlogVideoSectionContext";

import { sortComponents as sortComponents } from "^helpers/general";
import { Blog as BlogType } from "^types/blog";

import BodyUnpopulated from "^components/article-like/entity-page/article/Body";

import ImageSection from "./image-section";
import TextSection from "./TextSection";
import VideoSection from "./video-section";
import AddSectionPopover from "./AddSectionPopover";

export default function Body() {
  const [{ body }] = BlogTranslationSlice.useContext();

  const bodySectionsSorted = sortComponents(body);

  return (
    <BodyUnpopulated
      addSectionMenu={({ isShowing, sectionToAddIndex }) => (
        <BodyUnpopulated.AddSectionMenu
          addSectionPopover={
            <AddSectionPopover sectionToAddIndex={sectionToAddIndex} />
          }
          isShowing={isShowing}
        />
      )}
    >
      {bodySectionsSorted.map((section) => (
        <SectionContentTypeSwitch section={section} key={section.id} />
      ))}
    </BodyUnpopulated>
  );
}

const SectionContentTypeSwitch = ({
  section,
}: {
  section: BlogType["translations"][number]["body"][number];
}) => {
  const { type } = section;
  const [{ id: blogId }] = BlogSlice.useContext();
  const [{ id: translationId }] = BlogTranslationSlice.useContext();

  const ids = {
    blogId,
    translationId,
  };

  if (type === "image") {
    return (
      <BlogImageSectionSlice.Provider {...ids} section={section}>
        <ImageSection />
      </BlogImageSectionSlice.Provider>
    );
  }
  if (type === "text") {
    return (
      <BlogTextSectionSlice.Provider {...ids} section={section}>
        <TextSection />
      </BlogTextSectionSlice.Provider>
    );
  }
  if (type === "video") {
    return (
      <BlogVideoSectionSlice.Provider {...ids} section={section}>
        <VideoSection />
      </BlogVideoSectionSlice.Provider>
    );
  }

  throw new Error("invalid section type");
};
