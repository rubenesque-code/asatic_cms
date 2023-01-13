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
import SubjectSlice from "^context/subjects/SubjectContext";
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
  const [
    { id: subjectId },
    { removeRelatedEntity: removeRelatedEntityFromSubject },
  ] = SubjectSlice.useContext();
  const [
    { id: articleId },
    { removeRelatedEntity: removeRelatedEntityFromArticle },
  ] = ArticleSlice.useContext();

  const handleRemove = () => {
    removeRelatedEntityFromSubject({
      relatedEntity: { id: articleId, name: "article" },
    });
    removeRelatedEntityFromArticle({
      relatedEntity: { id: subjectId, name: "subject" },
    });
  };

  return (
    <MenuPartial isShowing={isShowing} imageIsToggleable={false}>
      <CustomSectionComponentMenuButtons_ removeComponent={handleRemove} />
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
