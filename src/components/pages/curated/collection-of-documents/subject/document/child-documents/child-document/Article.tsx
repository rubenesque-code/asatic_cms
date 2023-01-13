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

const SubjectArticle = ({
  showImage = false,
  span,
}: {
  showImage?: boolean;
  span: 1 | 2;
}) => {
  return (
    <$ArticleLikeSummaryLayout_
      authors={<Authors />}
      date={<Date />}
      image={showImage ? <Image showImageOverride={showImage} /> : null}
      menu={(containerIsHovered) => <Menu isShowing={containerIsHovered} />}
      status={<Status />}
      text={<Text showImage={showImage} span={span} />}
      title={<Title />}
    />
  );
};

export default SubjectArticle;

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

const Text = ({ showImage, span }: { span: 1 | 2; showImage: boolean }) => {
  //
  return <TextPartial maxCharacters={200} />;
};
