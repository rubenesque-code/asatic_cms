/* eslint-disable @next/next/no-img-element */
import tw, { TwStyle } from "twin.macro";

import ContentMenu from "^components/menus/Content";
import {
  ToggleUseImageButton_,
  UpdateImageSrcButton_,
  UpdateImageVertPositionButtons_,
} from "../ImageMenu_";
import { $Container_, $Empty_ } from "../../_presentation/$SummaryImage_";
import MyImage from "^components/images/MyImage";
import ResizeImage from "^components/resize/Image";
import { getThumbnailFromYoutubeId } from "^helpers/youtube";

export const Image_ = ({
  actions,
  data,
  containerStyles,
}: {
  containerStyles: TwStyle;
  data: {
    aspectRatio?: number;
    imageId?: string | null;
    isUsingImage?: boolean;
    vertPosition: number;
    type?: "youtubeId" | "storageImage";
    youtubeId?: string;
  };
  actions: {
    toggleUseImage?: () => void;
    updateAspectRatio?: (aspectRatio: number) => void;
    updateVertPosition: (vertPosition: number) => void;
    updateImageSrc: (imageId: string) => void;
  };
}) => {
  if (!data.isUsingImage) {
    return null;
  }

  return (
    <$Container_
      menu={(containerIsHovered) => (
        <ImageMenu_
          isShowing={containerIsHovered}
          actions={actions}
          data={{
            isImage: Boolean(data.imageId),
            vertPosition: data.vertPosition,
            isUsingImage: data.isUsingImage,
          }}
        />
      )}
      styles={containerStyles}
    >
      {data.imageId ? (
        data.aspectRatio && actions.updateAspectRatio ? (
          <ResizeImage
            aspectRatio={data.aspectRatio}
            onAspectRatioChange={actions.updateAspectRatio}
          >
            {data.type === "youtubeId" && data.youtubeId ? (
              <img
                css={[tw`absolute w-full h-full object-cover `]}
                src={getThumbnailFromYoutubeId(data.youtubeId)}
                style={{ objectPosition: `50% ${data.vertPosition || 50}%` }}
                alt=""
              />
            ) : (
              <MyImage
                imageId={data.imageId}
                vertPosition={data.vertPosition}
                objectFit="cover"
              />
            )}
          </ResizeImage>
        ) : data.type === "youtubeId" && data.youtubeId ? (
          <img
            css={[tw`absolute w-full h-full object-cover `]}
            src={getThumbnailFromYoutubeId(data.youtubeId)}
            style={{ objectPosition: `50% ${data.vertPosition || 50}%` }}
            alt=""
          />
        ) : (
          <MyImage
            imageId={data.imageId}
            vertPosition={data.vertPosition}
            objectFit="cover"
          />
        )
      ) : (
        <$Empty_ isToggleable={Boolean(actions.toggleUseImage)} />
      )}
    </$Container_>
  );
};

export const ImageMenu_ = ({
  isShowing,
  actions,
  data,
}: {
  isShowing: boolean;
  data: {
    isImage: boolean;
    isUsingImage?: boolean;
    vertPosition: number;
  };
  actions: {
    toggleUseImage?: () => void;
    updateVertPosition: (vertPosition: number) => void;
    updateImageSrc: (imageId: string) => void;
  };
}) => (
  <ContentMenu show={isShowing} styles={tw`absolute bottom-0 left-0`}>
    {data.isImage ? (
      <>
        <UpdateImageVertPositionButtons_
          vertPosition={data.vertPosition}
          updateVertPosition={actions.updateVertPosition}
        />
        <ContentMenu.VerticalBar />
      </>
    ) : null}
    <UpdateImageSrcButton_ updateImageSrc={actions.updateImageSrc} />
    {actions.toggleUseImage && data.isUsingImage ? (
      <>
        <ContentMenu.VerticalBar />
        <ToggleUseImageButton_ toggleUseImage={actions.toggleUseImage} />
      </>
    ) : null}
  </ContentMenu>
);
