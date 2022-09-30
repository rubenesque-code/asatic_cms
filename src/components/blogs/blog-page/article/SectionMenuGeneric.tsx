import { ComponentProps } from "react";

import BlogTranslationSlice from "^context/blogs/BlogTranslationContext";

import SectionMenuGenericUnpopulated from "^components/article-like/entity-page/article/SectionMenuGeneric";

type Props = Pick<
  ComponentProps<typeof SectionMenuGenericUnpopulated>,
  "isShowing" | "sectionIndex" | "children"
> & { sectionId: string };

const SectionMenuGeneric = ({
  children,
  isShowing,
  sectionId,
  sectionIndex,
}: Props) => {
  const [{ body }, { moveSection, removeBodySection }] =
    BlogTranslationSlice.useContext();

  return (
    <SectionMenuGenericUnpopulated
      isShowing={isShowing}
      moveSectionDown={() => moveSection({ direction: "down", sectionId })}
      moveSectionUp={() => moveSection({ direction: "up", sectionId })}
      numSections={body.length}
      removeSection={() => removeBodySection({ sectionId })}
      sectionIndex={sectionIndex}
    >
      {children}
    </SectionMenuGenericUnpopulated>
  );
};

export default SectionMenuGeneric;
