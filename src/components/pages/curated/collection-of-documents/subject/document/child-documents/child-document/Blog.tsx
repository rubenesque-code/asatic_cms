/* eslint-disable jsx-a11y/alt-text */
import SubjectSlice from "^context/subjects/SubjectContext";
import BlogSlice from "^context/blogs/BlogContext";
import BlogTranslationSlice from "^context/blogs/BlogTranslationContext";
import { useCustomSectionComponentContext } from "^context/CustomSectionComponentContext";
import { useArticleLikeSummaryText } from "^curated-pages/collection-of-documents/_hooks/useArticleLikeSummaryText";

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

const SubjectBlog = () => {
  const { showImageOverride } = useCustomSectionComponentContext();
  return (
    <$ArticleLikeSummaryLayout_
      authors={<Authors />}
      date={<Date />}
      image={
        showImageOverride ? (
          <Image showImageOverride={showImageOverride} />
        ) : null
      }
      menu={(containerIsHovered) => <Menu isShowing={containerIsHovered} />}
      status={<Status />}
      text={<Text />}
      title={<Title />}
    />
  );
};

export default SubjectBlog;

const Menu = ({ isShowing }: { isShowing: boolean }) => {
  const [
    { id: subjectId },
    { removeRelatedEntity: removeRelatedEntityFromSubject },
  ] = SubjectSlice.useContext();
  const [{ id: blogId }, { removeRelatedEntity: removeRelatedEntityFromBlog }] =
    BlogSlice.useContext();

  const handleRemove = () => {
    removeRelatedEntityFromSubject({
      relatedEntity: { id: blogId, name: "blog" },
    });
    removeRelatedEntityFromBlog({
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
  const [{ authorsIds, summaryImage }] = BlogSlice.useContext();
  const [{ title }] = BlogTranslationSlice.useContext();

  const maxCharacters = useArticleLikeSummaryText({
    authorsIds,
    summaryImage,
    title,
  });

  return <TextPartial maxCharacters={maxCharacters} />;
};
