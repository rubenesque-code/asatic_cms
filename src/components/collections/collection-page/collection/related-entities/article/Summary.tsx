/* eslint-disable jsx-a11y/alt-text */
import ArticleSlice from "^context/articles/ArticleContext";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";
import CollectionSlice from "^context/collections/CollectionContext";
import {
  Menu as Menu_,
  Text as Text_,
  Image as Image_,
} from "../article-like/Article";
import {
  Container,
  Authors as Authors_,
  Date as Date_,
  Title as Title_,
} from "../related-entity/Summary";
import { SubTitleContainer } from "../styles";

const Article = () => {
  return (
    <Container>
      {(isHovered) => (
        <>
          <Image />
          <Title />
          <SubTitleContainer>
            <Authors />
            <Date />
          </SubTitleContainer>
          <Text />
          <Menu isShowing={isHovered} />
        </>
      )}
    </Container>
  );
};

export default Article;

const Image = () => {
  const [
    { summaryImage },
    {
      toggleUseSummaryImage,
      updateSummaryImageSrc,
      updateSummaryImageVertPosition,
    },
  ] = ArticleSlice.useContext();

  return (
    <Image_
      imageId={summaryImage.imageId}
      toggleUseImage={toggleUseSummaryImage}
      updateImageSrc={(imageId) => updateSummaryImageSrc({ imageId })}
      updateVertPosition={(vertPosition) =>
        updateSummaryImageVertPosition({ vertPosition })
      }
      useImage={summaryImage.useImage}
      vertPosition={summaryImage.vertPosition || 50}
    />
  );
};

const Title = () => {
  const [{ title }] = ArticleTranslationSlice.useContext();

  return <Title_ title={title} />;
};

const Authors = () => {
  const [{ authorsIds }] = ArticleSlice.useContext();

  return <Authors_ authorsIds={authorsIds} />;
};

const Date = () => {
  const [{ publishDate }] = ArticleSlice.useContext();

  return <Date_ publishDate={publishDate} />;
};

const Text = () => {
  const [translation, { updateCollectionSummary }] =
    ArticleTranslationSlice.useContext();

  return (
    <Text_
      translation={translation}
      updateDocCollectionSummary={(summary) =>
        updateCollectionSummary({ summary })
      }
    />
  );
};

const Menu = ({ isShowing }: { isShowing: boolean }) => {
  const [{ id: collectionId }] = CollectionSlice.useContext();
  const [
    { summaryImage },
    {
      toggleUseSummaryImage,
      updateSummaryImageSrc,
      removeCollection,
      routeToEditPage,
    },
  ] = ArticleSlice.useContext();
  const [{ body }] = ArticleTranslationSlice.useContext();

  return (
    <Menu_
      articleBody={body}
      isShowing={isShowing}
      landingImageId={summaryImage.imageId}
      removeDocFromCollection={() => removeCollection({ collectionId })}
      toggleUseImage={toggleUseSummaryImage}
      updateImageSrc={(imageId) => updateSummaryImageSrc({ imageId })}
      useImage={summaryImage.useImage}
      routeToEditPage={routeToEditPage}
    />
  );
};
