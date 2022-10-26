import { ComponentProps, ReactElement } from "react";
import { JSONContent } from "@tiptap/core";
import dateformat from "dateformat";
import tw from "twin.macro";

import useTruncateTextEditorContent from "^hooks/useTruncateRichText";

import { DisplayEntityStatus, SummaryImage } from "^types/display-entity";
import { PrimaryEntityError } from "^types/primary-entity";

import ImageEmpty_ from "^components/display-entity/image/Empty";
import ImagePopulated_ from "^components/display-entity/image/Populated";
import DocAuthorsText from "^components/authors/DocAuthorsText";
import SimpleTipTapEditor from "^components/editors/tiptap/SimpleEditor";
import { GoToPageIcon } from "^components/Icons";
import {
  ToggleUseImageButton,
  ToggleUseImage,
} from "^components/display-entity/image/MenuButtons";
import ContainerUtility from "^components/ContainerUtilities";
import StatusLabel from "^components/StatusLabel";
import ContentMenu from "^components/menus/Content";
import {
  $Title,
  $Authors,
  $Date,
  $Text,
  $Status,
  $ImageContainer,
} from "../_styles/entity";
import { LandingColorTheme } from "^types/landing";
import { CollectionError } from "^types/collection";

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
  status: DisplayEntityStatus<PrimaryEntityError | CollectionError>;
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

export const Title_ = ({
  title,
  color,
}: {
  title: string | undefined;
  color: LandingColorTheme;
}) => {
  const isTitle = Boolean(title?.length);

  return (
    <$Title color={color} isTitle={isTitle}>
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

export const Date_ = ({ publishDate }: { publishDate: Date | undefined }) => {
  if (!publishDate) {
    return null;
  }

  const dateStr = dateformat(publishDate, "mmmm dS yyyy");

  return <$Date>{dateStr}</$Date>;
};

// todo: collection will use this?
export function Text_({
  numChars,
  text,
  updateEntityAutoSectionSummary,
}: {
  numChars: number;
  text: JSONContent | null | undefined;
  updateEntityAutoSectionSummary: (summary: JSONContent) => void;
}) {
  const { editorKey, truncated } = useTruncateTextEditorContent(text, numChars);

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
}: {
  imageId: string | undefined | null;
  updateImageSrc: (imageId: string) => void;
  updateVertPosition: (vertPosition: number) => void;
  toggleUseImage?: (() => void) | undefined;
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
        tooltipProps={{ text: "go to edit page" }}
      >
        <GoToPageIcon />
      </ContentMenu.Button>
    </ContentMenu>
  );
}
