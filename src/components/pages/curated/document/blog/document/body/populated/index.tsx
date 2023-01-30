import BlogSlice from "^context/blogs/BlogContext";
import BlogTranslationSlice from "^context/blogs/BlogTranslationContext";
import BlogImageSectionSlice from "^context/blogs/BlogImageSectionContext";
import BlogTextSectionSlice from "^context/blogs/BlogTextSectionContext";
import BlogVideoSectionSlice from "^context/blogs/BlogVideoSectionContext";

import { Blog as BlogType } from "^types/blog";

import { $DocumentBodyPopulated_ } from "^components/pages/curated/document/_presentation/article-like";
import AddSectionPopover from "../AddSectionPopover";
import ImageSection from "./image-section";
import TextSection from "./TextSection";
import VideoSection from "./video-section";
import BlogTableSectionSlice from "^context/blogs/BlogTableSectionContext";
import TableSection from "./table-section";

const Populated = () => {
  const [{ body }] = BlogTranslationSlice.useContext();

  return (
    <$DocumentBodyPopulated_
      addSectionPopover={(button, sectionToAddIndex) => (
        <AddSectionPopover sectionToAddIndex={sectionToAddIndex}>
          {button}
        </AddSectionPopover>
      )}
    >
      {body.map((section) => (
        <SectionTypeSwitch section={section} key={section.id} />
      ))}
    </$DocumentBodyPopulated_>
  );
};

export default Populated;

const SectionTypeSwitch = ({
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

  if (type === "table") {
    return (
      <BlogTableSectionSlice.Provider {...ids} section={section}>
        <TableSection />
      </BlogTableSectionSlice.Provider>
    );
  }

  return (
    <BlogVideoSectionSlice.Provider {...ids} section={section}>
      <VideoSection />
    </BlogVideoSectionSlice.Provider>
  );
};
