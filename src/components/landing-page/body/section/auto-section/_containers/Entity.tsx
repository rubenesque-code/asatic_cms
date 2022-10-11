import { JSONContent } from "@tiptap/core";
import { ComponentProps, ReactElement } from "react";

import ImageEmpty_ from "^components/display-entity/image/Empty";
import ImagePopulated_ from "^components/display-entity/image/Populated";
import DocAuthorsText from "^components/authors/DocAuthorsText";
import SimpleTipTapEditor from "^components/editors/tiptap/SimpleEditor";
import StatusLabel from "^components/StatusLabel";
import { getArticleSummaryFromTranslation } from "^helpers/article-like";
import useTruncateTextEditorContent from "^hooks/useTruncateTextEditorContent";
import { ArticleLikeTranslation } from "^types/article-like-entity";
import { SummaryImage } from "^types/display-entity";
import { PrimaryEntityStatus } from "^types/primary-entity";

import {
  $Title,
  $Authors,
  $Text,
  $Status,
  $ImageContainer,
} from "../_styles/entity";
import ContentMenu from "^components/menus/Content";
import { EditEntityIcon } from "^components/Icons";
import {
  ToggleUseImageButton,
  ToggleUseImage,
} from "^components/display-entity/image/MenuButtons";
import ContainerUtility from "^components/ContainerUtilities";
import tw from "twin.macro";

export const Container_ = ({
  children,
}: {
  children: (isHovered: boolean) => ReactElement;
}) => (
  <ContainerUtility.isHovered styles={tw`relative`}>
    {(isHovered) => children(isHovered)}
  </ContainerUtility.isHovered>
);

// todo: collection status?
export const Status_ = ({
  publishDate,
  status,
}: {
  publishDate: Date | undefined;
  status: PrimaryEntityStatus;
}) => {
  if (status === "good") {
    return null;
  }
  return (
    <$Status>
      <StatusLabel publishDate={publishDate} status={status} onlyShowUnready />
    </$Status>
  );
};

export const Title_ = ({ title }: { title: string | undefined }) => {
  const isTitle = Boolean(title?.length);

  return (
    <$Title color="cream" isTitle={isTitle}>
      {isTitle ? title : "Title"}
    </$Title>
  );
};

export const Authors_ = (props: ComponentProps<typeof DocAuthorsText>) => {
  if (!props.authorIds.length) {
    return null;
  }

  return (
    <$Authors>
      <DocAuthorsText {...props} />
    </$Authors>
  );
};

// todo: collection will use this?
export function Text_<TTranslation extends ArticleLikeTranslation>({
  translation,
  updateEntityAutoSectionSummary,
  isAuthor,
  isImage,
}: {
  translation: TTranslation;
  updateEntityAutoSectionSummary: (summary: JSONContent) => void;
  isAuthor?: boolean;
  isImage?: boolean;
}) {
  const summary = getArticleSummaryFromTranslation(translation, "collection");

  const numChars =
    isAuthor && isImage ? 110 : isImage ? 150 : isAuthor ? 200 : 240;

  const { editorKey, truncated } = useTruncateTextEditorContent(
    summary,
    numChars
  );

  return (
    <$Text>
      <SimpleTipTapEditor
        placeholder="Summary"
        initialContent={truncated || undefined}
        onUpdate={updateEntityAutoSectionSummary}
        key={editorKey}
      />
    </$Text>
  );
}

export function Image_({
  imageId,
  summaryImage,
  updateImageSrc,
  updateVertPosition,
  toggleUseImage: toggleUseImageFunc,
}: // menuContainerStyles
{
  imageId: string | undefined | null;
  updateImageSrc: (imageId: string) => void;
  updateVertPosition: (vertPosition: number) => void;
  toggleUseImage?: (() => void) | undefined;
  // menuContainerStyles: TwStyle
} & SummaryImage) {
  if (!summaryImage.useImage) {
    return null;
  }

  const toggleUseImage = toggleUseImageFunc
    ? {
        isUsingImage: true,
        toggleUseImage: toggleUseImageFunc,
      }
    : undefined;

  const sharedProps = {
    menuContainerStyles: tw`left-0 bottom-0`,
    updateImageSrc,
    toggleUseImage,
  };

  return (
    <$ImageContainer>
      {imageId ? (
        <ImagePopulated_
          imageId={imageId}
          updateVertPosition={updateVertPosition}
          vertPosition={summaryImage.vertPosition || 50}
          {...sharedProps}
        />
      ) : (
        <ImageEmpty_ {...sharedProps} />
      )}
    </$ImageContainer>
  );
}

export function Menu_({
  isShowing,
  routeToEditPage,
  toggleUseImage,
}: {
  isShowing: boolean;
  routeToEditPage: () => void;
  toggleUseImage?: ToggleUseImage;
}) {
  return (
    <ContentMenu show={isShowing} styles={tw`absolute right-0 top-0`}>
      {toggleUseImage ? (
        <>
          <ToggleUseImageButton {...toggleUseImage} />
          <ContentMenu.VerticalBar />
        </>
      ) : null}
      <ContentMenu.Button
        onClick={routeToEditPage}
        tooltipProps={{ text: "go to edit document page" }}
      >
        <EditEntityIcon />
      </ContentMenu.Button>
    </ContentMenu>
  );
}
