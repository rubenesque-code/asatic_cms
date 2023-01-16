import BlogTranslationSlice from "^context/blogs/BlogTranslationContext";
import {
  $SectionMenu_,
  $SectionMenuProps,
} from "^components/pages/curated/document/_presentation/article-like";

export type SectionMenuProps = { sectionId: string } & Pick<
  $SectionMenuProps,
  "children" | "isShowing" | "sectionIndex"
>;

const SectionMenu_ = ({ sectionId, ...menuProps }: SectionMenuProps) => {
  const [{ body }, { moveSection, removeBodySection }] =
    BlogTranslationSlice.useContext();

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

export default SectionMenu_;
