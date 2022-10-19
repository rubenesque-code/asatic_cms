import { ReactElement } from "react";
import { nanoid } from "@reduxjs/toolkit";

import BlogTranslationSlice from "^context/blogs/BlogTranslationContext";

import {
  createArticleLikeImageSection,
  createArticleLikeTextSection,
  createArticleLikeVideoSection,
} from "^data/createDocument";

import AddSectionPopoverUnpopulated from "^components/article-like/entity-page/article/AddSectionPopover";

const AddSectionPopover = ({
  children: button,
  sectionToAddIndex,
}: {
  children: ReactElement;
  sectionToAddIndex: number;
}) => {
  const [, { addBodySection }] = BlogTranslationSlice.useContext();

  const addImageSection = () =>
    addBodySection({
      sectionData: createArticleLikeImageSection({
        id: nanoid(),
        index: sectionToAddIndex,
      }),
    });
  const addTextSection = () =>
    addBodySection({
      sectionData: createArticleLikeTextSection({
        id: nanoid(),
        index: sectionToAddIndex,
      }),
    });
  const addVideoSection = () =>
    addBodySection({
      sectionData: createArticleLikeVideoSection({
        id: nanoid(),
        index: sectionToAddIndex,
      }),
    });

  return (
    <AddSectionPopoverUnpopulated
      addImageSection={addImageSection}
      addTextSection={addTextSection}
      addVideoSection={addVideoSection}
    >
      {button}
    </AddSectionPopoverUnpopulated>
  );
};

export default AddSectionPopover;
