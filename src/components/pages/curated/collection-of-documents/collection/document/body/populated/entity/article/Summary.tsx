/* eslint-disable jsx-a11y/alt-text */
import CollectionSlice from "^context/collections/CollectionContext";
import ArticleSlice from "^context/articles/ArticleContext";

import {
  Authors,
  Image,
  Menu as MenuPartial,
  Status,
  Text as TextPartial,
  Title,
  Date,
} from "^curated-pages/collection-of-documents/_components/ArticleSummary";
import { $Container_ } from "../_presentation/$Summary_";
import { $SubTitle } from "../_styles";
import { CustomSectionComponentMenuButtons_ } from "^components/pages/curated/collection-of-documents/_containers/summary";
import tw from "twin.macro";

const $imageContainer = tw`relative w-[250px] aspect-ratio[16 / 9] float-left mr-sm`;

const Summary = () => {
  return (
    <$Container_>
      {(isHovered) => (
        <>
          <div css={[$imageContainer]}>
            <Image />
          </div>
          <Title />
          <$SubTitle>
            <Authors />
            <Date />
          </$SubTitle>
          <Text />
          <Status />
          <Menu isShowing={isHovered} />
        </>
      )}
    </$Container_>
  );
};

export default Summary;

const Text = () => {
  return <TextPartial maxCharacters={300} />;
};

const Menu = ({ isShowing }: { isShowing: boolean }) => {
  const [
    { id: collectionId },
    { removeRelatedEntity: removeRelatedEntityFromCollection },
  ] = CollectionSlice.useContext();
  const [
    { id: articleId },
    { removeRelatedEntity: removeRelatedEntityFromArticle },
  ] = ArticleSlice.useContext();

  const handleRemove = () => {
    removeRelatedEntityFromCollection({
      relatedEntity: { id: articleId, name: "article" },
    });
    removeRelatedEntityFromArticle({
      relatedEntity: { id: collectionId, name: "collection" },
    });
  };

  return (
    <MenuPartial isShowing={isShowing} imageIsToggleable>
      <CustomSectionComponentMenuButtons_ removeComponent={handleRemove} />
    </MenuPartial>
  );
};
