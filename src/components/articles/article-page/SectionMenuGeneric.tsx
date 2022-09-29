import { ComponentProps } from "react";
import SectionMenuGenericUnpopulated from "^components/article-like/entity-page/article/SectionMenuGeneric";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";

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
    ArticleTranslationSlice.useContext();

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
