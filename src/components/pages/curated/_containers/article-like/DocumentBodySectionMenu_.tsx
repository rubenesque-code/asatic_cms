import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";
import {
  $SectionMenu_,
  SectionMenuProps,
} from "../../_presentation/article-like";

export type DocumentBodySectionMenuProps = { sectionId: string } & Pick<
  SectionMenuProps,
  "children" | "isShowing" | "sectionIndex"
>;

export const DocumentBodySectionMenu_ = ({
  sectionId,
  ...menuProps
}: DocumentBodySectionMenuProps) => {
  const [{ body }, { moveSection, removeBodySection }] =
    ArticleTranslationSlice.useContext();

  return (
    <$SectionMenu_
      moveSectionDown={() => moveSection({ direction: "down", sectionId })}
      moveSectionUp={() => moveSection({ direction: "up", sectionId })}
      numSections={body.length}
      removeSection={() => removeBodySection({ sectionId })}
      {...menuProps}
    />
  );
};
