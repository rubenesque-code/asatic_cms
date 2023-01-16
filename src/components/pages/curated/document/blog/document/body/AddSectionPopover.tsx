import { ReactElement } from "react";
import { nanoid } from "@reduxjs/toolkit";

import BlogTranslationSlice from "^context/blogs/BlogTranslationContext";

import { $AddDocumentBodySectionPopover_ } from "^components/pages/curated/document/_presentation/article-like";

import {
  createArticleLikeImageSection,
  createArticleLikeTextSection,
  createArticleLikeVideoSection,
} from "^data/createDocument";

const AddSectionPopover = ({
  children: button,
  sectionToAddIndex,
}: {
  children: ReactElement;
  sectionToAddIndex: number;
}) => {
  const [, { addBodySection }] = BlogTranslationSlice.useContext();

  const sharedArgs = {
    id: nanoid(),
    index: sectionToAddIndex,
  };

  const addSection = (type: "image" | "text" | "video") =>
    addBodySection({
      sectionData:
        type === "image"
          ? createArticleLikeImageSection(sharedArgs)
          : type === "text"
          ? createArticleLikeTextSection(sharedArgs)
          : createArticleLikeVideoSection(sharedArgs),
    });

  return (
    <$AddDocumentBodySectionPopover_
      addImageSection={() => addSection("image")}
      addTextSection={() => addSection("text")}
      addVideoSection={() => addSection("video")}
    >
      {button}
    </$AddDocumentBodySectionPopover_>
  );
};

export default AddSectionPopover;
