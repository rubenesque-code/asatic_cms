import { ReactElement } from "react";
import { Image as ImageIcon } from "phosphor-react";

import MyImage from "^components/images/MyImage";
import ResizeImage from "^components/resize/Image";
import WithAddDocImage from "^components/WithAddDocImage";
import MediaSection from "^components/display-entity/entity-page/article/MediaSection";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function ImageSection() {}

ImageSection.Image = function Image_({
  aspectRatio,
  imageId,
  updateAspectRatio,
  vertPosition,
}: {
  aspectRatio: number;
  imageId: string;
  updateAspectRatio: (aspectRatio: number) => void;
  vertPosition: number;
}) {
  return (
    <ResizeImage
      aspectRatio={aspectRatio}
      onAspectRatioChange={(aspectRatio) => updateAspectRatio(aspectRatio)}
    >
      <MyImage
        imageId={imageId}
        objectFit="cover"
        vertPosition={vertPosition}
      />
    </ResizeImage>
  );
};

ImageSection.Empty = function Empty({
  children,
  updateImageSrc,
}: {
  children?: (isHovered: boolean) => ReactElement;
  updateImageSrc: (imageId: string) => void;
}) {
  return (
    <MediaSection.Empty title="Image section">
      {(isHovered) => (
        <>
          <WithAddDocImage onAddImage={updateImageSrc}>
            <MediaSection.Empty.AddContentButton text="Add image">
              <ImageIcon />
            </MediaSection.Empty.AddContentButton>
          </WithAddDocImage>
          {children ? children(isHovered) : null}
        </>
      )}
    </MediaSection.Empty>
  );
};
