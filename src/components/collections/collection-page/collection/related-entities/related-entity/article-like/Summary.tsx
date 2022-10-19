import { ReactElement } from "react";
import tw from "twin.macro";
import { JSONContent } from "@tiptap/core";

import useTruncateTextEditorContent from "^hooks/useTruncateTextEditorContent";

import {
  getArticleSummaryFromTranslation,
  getImageFromArticleBody,
} from "^helpers/article-like";

import { ArticleLikeTranslation } from "^types/article-like-entity";
// import

import ContainerUtility from "^components/ContainerUtilities";
import SimpleTipTapEditor from "^components/editors/tiptap/SimpleEditor";
import ContentMenu from "^components/menus/Content";
import WithAddDocImage from "^components/WithAddDocImage";
import { ImageIcon } from "^components/Icons";

import { Empty, Populated } from "./Image";
import { Menu as Menu_ } from "../Summary";
import { Text as Text_, ImageContainer } from "../styles";

export const Article = ({
  children,
}: {
  children: (isHovered: boolean) => ReactElement;
}) => {
  return (
    <ContainerUtility.isHovered styles={tw`relative`}>
      {(isHovered) => children(isHovered)}
    </ContainerUtility.isHovered>
  );
};

export const Image = ({
  imageId,
  toggleUseImage,
  updateImageSrc,
  useImage,
  updateVertPosition,
  vertPosition,
}: {
  useImage: boolean;
  imageId: string | undefined;
  toggleUseImage: { toggleUseImage: () => void; isUsingImage: boolean };
  updateImageSrc: (imageId: string) => void;
  updateVertPosition: (vertPosition: number) => void;
  vertPosition: number;
}) => {
  if (!useImage) {
    return null;
  }

  return (
    <ImageContainer>
      {imageId ? (
        <Populated
          imageId={imageId}
          toggleUseImage={toggleUseImage}
          updateImageSrc={updateImageSrc}
          updateVertPosition={updateVertPosition}
          vertPosition={vertPosition}
        />
      ) : (
        <Empty
          toggleUseImage={toggleUseImage.toggleUseImage}
          updateImageSrc={updateImageSrc}
        />
      )}
    </ImageContainer>
  );
};

export function Text<TTranslation extends ArticleLikeTranslation>({
  translation,
  updateDocCollectionSummary,
}: {
  translation: TTranslation;
  updateDocCollectionSummary: (summary: JSONContent) => void;
}) {
  const summary = getArticleSummaryFromTranslation(translation, "collection");

  const { editorKey, truncated } = useTruncateTextEditorContent(summary);

  return (
    <Text_>
      <SimpleTipTapEditor
        initialContent={truncated || undefined}
        onUpdate={updateDocCollectionSummary}
        placeholder="Summary"
        key={editorKey}
      />
    </Text_>
  );
}

export const Menu = ({
  isShowing,
  routeToEditPage,
  ...props
}: {
  isShowing: boolean;
  routeToEditPage: () => void;
  removeDocFromCollection: () => void;
} & MenuImageButtonProps) => {
  const { removeDocFromCollection } = props;

  return (
    <Menu_
      isShowing={isShowing}
      removeDocFromCollection={removeDocFromCollection}
      routeToEditPage={routeToEditPage}
    >
      <MenuImageButton {...props} />
    </Menu_>
  );
};

type MenuImageButtonProps = {
  articleBody: ArticleLikeTranslation["body"];
  landingImageId: string | undefined;
  toggleUseImage: () => void;
  updateImageSrc: (imageId: string) => void;
  useImage: boolean;
};

const MenuImageButton = ({
  articleBody,
  landingImageId,
  toggleUseImage,
  updateImageSrc,
  useImage,
}: MenuImageButtonProps) => {
  const isImage = landingImageId
    ? landingImageId
    : getImageFromArticleBody(articleBody);

  if (useImage) {
    return null;
  }

  return (
    <>
      {isImage ? (
        <ContentMenu.Button
          tooltipProps={{ text: "add image" }}
          onClick={toggleUseImage}
        >
          <ImageIcon />
        </ContentMenu.Button>
      ) : (
        <WithAddDocImage
          onAddImage={(imageId) => {
            updateImageSrc(imageId);
            toggleUseImage();
          }}
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
