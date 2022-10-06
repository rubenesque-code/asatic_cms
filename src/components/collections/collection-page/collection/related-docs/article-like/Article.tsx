import { ReactElement } from "react";
import { Image as ImageIcon, Trash } from "phosphor-react";
import tw from "twin.macro";
import dateformat from "dateformat";
import { JSONContent } from "@tiptap/core";

import useTruncateTextEditorContent from "^hooks/useTruncateTextEditorContent";

import {
  getArticleSummaryFromTranslation,
  getFirstImageFromArticleBody,
} from "^helpers/article-like";

import { ArticleLikeTranslation } from "^types/article-like-entity";

import DocAuthorsText from "^components/authors/DocAuthorsText";
import ContainerUtility from "^components/ContainerUtilities";
import DocLanguages from "^components/DocLanguages";
import SimpleTipTapEditor from "^components/editors/tiptap/SimpleEditor";
import ContentMenu from "^components/menus/Content";
import WithAddDocImage from "^components/WithAddDocImage";

import { Empty, Populated } from "./Image";
import {
  Title as Title_,
  Text as Text_,
  Authors as Authors_,
  menu,
  ImageContainer,
} from "../styles";

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
  toggleUseImage: () => void;
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
          toggleUseImage={toggleUseImage}
          updateImageSrc={updateImageSrc}
        />
      )}
    </ImageContainer>
  );
};

export const Title = ({ title }: { title: string | undefined }) => {
  return <Title_ css={[!title && tw`text-gray-placeholder`]}>{title}</Title_>;
};

export const Authors = ({ authorsIds }: { authorsIds: string[] }) => {
  const [{ activeLanguageId }] = DocLanguages.useContext();

  if (!authorsIds.length) {
    return null;
  }

  return (
    <Authors_>
      <DocAuthorsText
        authorIds={authorsIds}
        docActiveLanguageId={activeLanguageId}
      />
      ,
    </Authors_>
  );
};

export const Date = ({ publishDate }: { publishDate: Date | undefined }) => {
  if (!publishDate) {
    return null;
  }

  const dateStr = dateformat(publishDate, "mmmm dS yyyy");

  return <>{dateStr}</>;
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
        initialContent={truncated}
        onUpdate={updateDocCollectionSummary}
        placeholder="Summary"
        key={editorKey}
      />
    </Text_>
  );
}

export const Menu = ({
  isShowing,
  ...props
}: {
  isShowing: boolean;
  removeDocFromCollection: () => void;
} & MenuImageButtonProps) => {
  const { removeDocFromCollection } = props;

  return (
    <ContentMenu show={isShowing} styles={menu}>
      <>
        <MenuImageButton {...props} />
        <ContentMenu.ButtonWithWarning
          tooltipProps={{ text: "remove document from collection" }}
          warningProps={{
            callbackToConfirm: removeDocFromCollection,
            warningText: "Remove document from collection?",
          }}
        >
          <Trash />
        </ContentMenu.ButtonWithWarning>
      </>
    </ContentMenu>
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
    : getFirstImageFromArticleBody(articleBody);

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
        <WithAddDocImage onAddImage={updateImageSrc}>
          <ContentMenu.Button tooltipProps={{ text: "add image" }}>
            <ImageIcon />
          </ContentMenu.Button>
        </WithAddDocImage>
      )}
      <ContentMenu.VerticalBar />
    </>
  );
};
