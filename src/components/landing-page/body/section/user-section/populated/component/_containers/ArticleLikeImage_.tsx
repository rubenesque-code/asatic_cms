import tw from "twin.macro";

import { getImageFromArticleBody } from "^helpers/article-like";
import { ArticleLikeTranslation } from "^types/article-like-entity";
import { LandingCustomSection } from "^types/primary-entity";
import { SummaryImage } from "^types/display-entity";

import MyImage from "^components/images/MyImage";
import ResizeImage from "^components/resize/Image";
import ContentMenu from "^components/menus/Content";
import { TurnOffIcon } from "^components/Icons";
import ImageMenuButtons from "^components/display-entity/image/MenuButtons";
import { $ImageContainer_, $ImageEmpty_ } from "../_presentation/$Image_";

const ArticleLikeImage_ = ({
  entityType,
  summaryImage,
  body,
  landingCustomSection,
  updateAspectRatio,
  toggleUseImage,
  updateImageSrc,
  updateVertPosition,
}: {
  body: ArticleLikeTranslation["body"];
  entityType: "article" | "blog";
} & SummaryImage &
  LandingCustomSection &
  UpdateAspectRatioProp &
  UpdateVertPositionProp &
  UpdateImageSrcProp &
  ToggleUseImageProp) => {
  if (!summaryImage.useImage) {
    return null;
  }

  const imageId = summaryImage.imageId || getImageFromArticleBody(body);

  return (
    <$ImageContainer_>
      {(isHovered) => (
        <>
          {imageId ? (
            <ImagePopulated
              imageId={imageId}
              landingCustomSection={landingCustomSection}
              updateAspectRatio={updateAspectRatio}
            />
          ) : (
            <$ImageEmpty_ entityType={entityType} imageIsRemovable />
          )}
          <ImageMenu
            isImage={Boolean(imageId)}
            isShowing={isHovered}
            landingCustomSection={landingCustomSection}
            summaryImage={summaryImage}
            toggleUseImage={toggleUseImage}
            updateImageSrc={updateImageSrc}
            updateVertPosition={updateVertPosition}
          />
        </>
      )}
    </$ImageContainer_>
  );
};

export default ArticleLikeImage_;

type UpdateAspectRatioProp = {
  updateAspectRatio: (aspectRatio: number) => void;
};

const ImagePopulated = ({
  imageId,
  landingCustomSection,
  updateAspectRatio,
}: {
  imageId: string;
} & LandingCustomSection &
  UpdateAspectRatioProp) => {
  return (
    <ResizeImage
      aspectRatio={landingCustomSection.imgAspectRatio}
      onAspectRatioChange={updateAspectRatio}
    >
      <MyImage
        imgId={imageId}
        objectFit="cover"
        vertPosition={landingCustomSection.imgVertPosition || 50}
      />
    </ResizeImage>
  );
};

type UpdateImageSrcProp = { updateImageSrc: (imageId: string) => void };
type UpdateVertPositionProp = {
  updateVertPosition: (vertPosition: number) => void;
};
type ToggleUseImageProp = { toggleUseImage: () => void };

const ImageMenu = ({
  isShowing,
  isImage,
  landingCustomSection,
  summaryImage,
  toggleUseImage,
  updateImageSrc,
  updateVertPosition,
}: {
  isShowing: boolean;
  isImage: boolean;
} & LandingCustomSection &
  SummaryImage &
  UpdateImageSrcProp &
  UpdateVertPositionProp &
  ToggleUseImageProp) => {
  return (
    <ContentMenu show={isShowing} styles={tw`absolute right-0 top-0`}>
      {summaryImage.useImage ? (
        <>
          <ContentMenu.Button
            onClick={toggleUseImage}
            tooltipProps={{ text: "remove image" }}
          >
            <TurnOffIcon />
          </ContentMenu.Button>
          <ContentMenu.VerticalBar />
        </>
      ) : null}
      <ImageMenuButtons
        isImage={isImage}
        updateImageSrc={updateImageSrc}
        updateVertPosition={updateVertPosition}
        vertPosition={landingCustomSection.imgVertPosition}
      />
    </ContentMenu>
  );
};
