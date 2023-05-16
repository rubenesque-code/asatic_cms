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
} from "^curated-pages/collection-of-documents/_components/ArticleSummary";
import { CustomSectionComponentMenuButtons_ } from "^curated-pages/collection-of-documents/_containers/summary";
import ArticleSlice from "^context/articles/ArticleContext";
import { useCustomSectionComponentContext } from "^context/CustomSectionComponentContext";
import { useArticleLikeSummaryText } from "^curated-pages/collection-of-documents/_hooks/useArticleLikeSummaryText";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";

const LandingArticleSummary = () => {
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

export default LandingArticleSummary;

const Menu = ({ isShowing }: { isShowing: boolean }) => {
  const { removeFromParent, colSpan, changeColSpan } =
    useCustomSectionComponentContext();
  const [
    { id: articleId },
    { removeRelatedEntity: removeRelatedEntityFromArticle },
  ] = ArticleSlice.useContext();

  const handleRemove = () => {
    removeFromParent.func({
      id: articleId,
      name: "article",
    });
    if (removeFromParent.parent.name === "landing") {
      return;
    }
    removeRelatedEntityFromArticle({
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
  const [{ authorsIds, summaryImage }] = ArticleSlice.useContext();
  const [{ title }] = ArticleTranslationSlice.useContext();

  const maxCharacters = useArticleLikeSummaryText({
    authorsIds,
    summaryImage,
    title,
  });

  return <TextPartial maxCharacters={maxCharacters} />;
};
