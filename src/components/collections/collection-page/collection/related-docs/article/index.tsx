/* eslint-disable jsx-a11y/alt-text */
import tw from "twin.macro";
import dateformat from "dateformat";
import { Image as ImageIcon, Trash } from "phosphor-react";

import CollectionSlice from "^context/collections/CollectionContext";
import ArticleSlice from "^context/articles/ArticleContext";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";

import {
  getArticleSummaryFromTranslation,
  getFirstImageFromArticleBody,
  truncateText,
} from "^helpers/article";

import DocAuthorsText from "^components/authors/DocAuthorsText";
import DocLanguages from "^components/DocLanguages";
import SimpleTipTapEditor from "^components/editors/tiptap/SimpleEditor";
import ContentMenu from "^components/menus/Content";
import WithAddDocImage from "^components/WithAddDocImage";
import ContainerUtility from "^components/ContainerUtilities";

import Image from "./Image";
import { Title as Title_, SubTitleContainer, Text as Text_ } from "../styles";
import { TipTapTextDoc } from "^helpers/tiptap";
import { useEffect, useRef, useState } from "react";
import isEqual from "lodash.isequal";

const Article = () => {
  return (
    <ContainerUtility.isHovered styles={tw`relative`}>
      {(isHovered) => (
        <>
          <Image />
          <div>
            <Title />
            <SubTitleContainer>
              <Authors />
              <Date />
            </SubTitleContainer>
            <Text />
          </div>
          <Menu isShowing={isHovered} />
        </>
      )}
    </ContainerUtility.isHovered>
  );
};

export default Article;

const Title = () => {
  const [{ title }] = ArticleTranslationSlice.useContext();

  return <Title_ css={[!title && tw`text-gray-placeholder`]}>{title}</Title_>;
};

const Authors = () => {
  const [{ activeLanguageId }] = DocLanguages.useContext();
  const [{ authorsIds }] = ArticleSlice.useContext();

  if (!authorsIds.length) {
    return null;
  }

  return (
    <div css={[tw`flex items-center`]}>
      <DocAuthorsText
        authorIds={authorsIds}
        docActiveLanguageId={activeLanguageId}
      />
      ,
    </div>
  );
};

const Date = () => {
  const [{ publishDate }] = ArticleSlice.useContext();

  if (!publishDate) {
    return null;
  }

  const dateStr = dateformat(publishDate, "mmmm dS yyyy");

  return <>{dateStr}</>;
};

const Text = () => {
  const [editorKey, setEditorKey] = useState(Math.random());

  const [translation, { updateCollectionSummary }] =
    ArticleTranslationSlice.useContext();

  const summary = getArticleSummaryFromTranslation(translation, "collection");

  const truncated = summary
    ? truncateText(summary as TipTapTextDoc, 240)
    : null;

  const truncatedPrevRef = useRef(truncated);
  const truncatedPrev = truncatedPrevRef.current;

  const isChange = !isEqual(truncated, truncatedPrev);

  useEffect(() => {
    if (isChange) {
      truncatedPrevRef.current = truncated;
      setEditorKey(Math.random());
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChange]);

  return (
    <Text_>
      <SimpleTipTapEditor
        initialContent={truncated || undefined}
        onUpdate={(summary) => updateCollectionSummary({ summary })}
        placeholder="Summary"
        key={editorKey}
        // lineClamp="line-clamp-5"
      />
    </Text_>
  );
};

const Menu = ({ isShowing }: { isShowing: boolean }) => {
  const [{ id: collectionId }] = CollectionSlice.useContext();
  const [, { removeCollection }] = ArticleSlice.useContext();

  return (
    <ContentMenu show={isShowing} styles={tw`absolute right-0 top-0`}>
      <>
        <MenuImageButton />
        <ContentMenu.ButtonWithWarning
          tooltipProps={{ text: "remove document from collection" }}
          warningProps={{
            callbackToConfirm: () => removeCollection({ collectionId }),
            warningText: "Remove document from collection?",
          }}
        >
          <Trash />
        </ContentMenu.ButtonWithWarning>
      </>
    </ContentMenu>
  );
};

const MenuImageButton = () => {
  const [
    {
      landingImage: { useImage, imageId },
    },
    { toggleUseLandingImage, updateLandingImageSrc },
  ] = ArticleSlice.useContext();
  const [{ body }] = ArticleTranslationSlice.useContext();

  const isImage = imageId ? imageId : getFirstImageFromArticleBody(body);

  if (useImage) {
    return null;
  }

  return (
    <>
      {isImage ? (
        <ContentMenu.Button
          tooltipProps={{ text: "add image" }}
          onClick={toggleUseLandingImage}
        >
          <ImageIcon />
        </ContentMenu.Button>
      ) : (
        <WithAddDocImage
          onAddImage={(imageId) => updateLandingImageSrc({ imageId })}
        >
          <ContentMenu.Button tooltipProps={{ text: "add image" }}>
            <ImageIcon />
          </ContentMenu.Button>
        </WithAddDocImage>
      )}
      <ContentMenu.VerticalBar />
    </>
  );
};
