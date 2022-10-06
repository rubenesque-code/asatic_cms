/* eslint-disable jsx-a11y/alt-text */
import BlogSlice from "^context/blogs/BlogContext";
import BlogTranslationSlice from "^context/blogs/BlogTranslationContext";
import CollectionSlice from "^context/collections/CollectionContext";

import {
  Article as Article_,
  Authors as Authors_,
  Date as Date_,
  Menu as Menu_,
  Text as Text_,
  Title as Title_,
  Image as Image_,
} from "../article-like/Article";
import { SubTitleContainer } from "../styles";

const Article = () => {
  return (
    <Article_>
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
    </Article_>
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
  ] = BlogSlice.useContext();

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
  const [{ title }] = BlogTranslationSlice.useContext();

  return <Title_ title={title} />;
};

const Authors = () => {
  const [{ authorsIds }] = BlogSlice.useContext();

  return <Authors_ authorsIds={authorsIds} />;
};

const Date = () => {
  const [{ publishDate }] = BlogSlice.useContext();

  return <Date_ publishDate={publishDate} />;
};

const Text = () => {
  const [translation, { updateCollectionSummary }] =
    BlogTranslationSlice.useContext();

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
    { toggleUseSummaryImage, updateSummaryImageSrc, removeCollection },
  ] = BlogSlice.useContext();
  const [{ body }] = BlogTranslationSlice.useContext();

  return (
    <Menu_
      articleBody={body}
      isShowing={isShowing}
      landingImageId={summaryImage.imageId}
      removeDocFromCollection={() => removeCollection({ collectionId })}
      toggleUseImage={toggleUseSummaryImage}
      updateImageSrc={(imageId) => updateSummaryImageSrc({ imageId })}
      useImage={summaryImage.useImage}
    />
  );
};
