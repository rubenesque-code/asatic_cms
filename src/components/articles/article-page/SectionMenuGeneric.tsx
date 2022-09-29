import { ComponentProps } from "react";
import SectionMenuGenericUnpopulated from "^components/article-like/entity-page/article/SectionMenuGeneric";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";

type Props = Pick<
  ComponentProps<typeof SectionMenuGenericUnpopulated>,
  "isShowing" | "sectionIndex"
> & { sectionId: string };

const SectionMenuGeneric = ({ isShowing, sectionId, sectionIndex }: Props) => {
  const [{ body }, { moveSection, removeBodySection }] =
    ArticleTranslationSlice.useContext();

  console.log("isShowing:", isShowing);

  return (
    <SectionMenuGenericUnpopulated
      isShowing={isShowing}
      moveSectionDown={() => moveSection({ direction: "down", sectionId })}
      moveSectionUp={() => moveSection({ direction: "up", sectionId })}
      numSections={body.length}
      removeSection={() => removeBodySection({ sectionId })}
      sectionIndex={sectionIndex}
    />
  );
};

export default SectionMenuGeneric;
