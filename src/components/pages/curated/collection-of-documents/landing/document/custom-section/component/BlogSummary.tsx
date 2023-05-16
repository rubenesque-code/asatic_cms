/* eslint-disable jsx-a11y/alt-text */
import { $ArticleLikeSummaryLayout_ } from "^curated-pages/collection-of-documents/_presentation";
import {
  Authors,
  Image,
  Menu as MenuPartial,
  Status,
  Text as TextPartial,
  Title,
  Date,
} from "^curated-pages/collection-of-documents/_components/BlogSummary";
import { CustomSectionComponentMenuButtons_ } from "^curated-pages/collection-of-documents/_containers/summary";
import { useCustomSectionComponentContext } from "^context/CustomSectionComponentContext";
import { useArticleLikeSummaryText } from "^curated-pages/collection-of-documents/_hooks/useArticleLikeSummaryText";
import BlogSlice from "^context/blogs/BlogContext";
import BlogTranslationSlice from "^context/blogs/BlogTranslationContext";

const LandingBlogSummary = () => {
  const { imageOverride } = useCustomSectionComponentContext();

  return (
    <$ArticleLikeSummaryLayout_
      authors={<Authors />}
      date={<Date />}
      image={
        imageOverride === "always-hide" ? null : (
          <Image imageOverride={imageOverride} />
        )
      }
      menu={(containerIsHovered) => <Menu isShowing={containerIsHovered} />}
      status={<Status />}
      text={<Text />}
      title={<Title />}
    />
  );
};

export default LandingBlogSummary;

const Menu = ({ isShowing }: { isShowing: boolean }) => {
  const { removeFromParent, colSpan, changeColSpan } =
    useCustomSectionComponentContext();
  const [{ id: blogId }, { removeRelatedEntity: removeRelatedEntityFromBlog }] =
    BlogSlice.useContext();

  const handleRemove = () => {
    removeFromParent.func({
      id: blogId,
      name: "blog",
    });
    if (removeFromParent.parent.name === "landing") {
      return;
    }
    removeRelatedEntityFromBlog({
      relatedEntity: removeFromParent.parent,
    });
  };

  return (
    <MenuPartial isShowing={isShowing} imageIsToggleable>
      <CustomSectionComponentMenuButtons_
        removeComponent={handleRemove}
        changeSpan={
          changeColSpan
            ? {
                canNarrow: colSpan === "1/2",
                canWiden: colSpan === "1/4",
                narrow: () => changeColSpan(1),
                widen: () => changeColSpan(2),
              }
            : undefined
        }
      />
    </MenuPartial>
  );
};

const Text = () => {
  const [{ authorsIds, summaryImage }] = BlogSlice.useContext();
  const [{ title }] = BlogTranslationSlice.useContext();

  const maxCharacters = useArticleLikeSummaryText({
    authorsIds,
    summaryImage,
    title,
  });

  return <TextPartial maxCharacters={maxCharacters} />;
};
