import tw, { TwStyle } from "twin.macro";

import ContentMenu from "^components/menus/Content";
import {
  ToggleUseImageButton_,
  UpdateImageSrcButton_,
  UpdateImageVertPositionButtons_,
} from "../ImageMenu_";
import { $Container_, $Empty_ } from "../../_presentation/$SummaryImage_";
import MyImage from "^components/images/MyImage";

export const Image_ = ({
  actions,
  data,
  containerStyles,
}: {
  containerStyles: TwStyle;
  data: {
    imageId: string | null;
    isUsingImage?: boolean;
    vertPosition: number;
  };
  actions: {
    toggleUseImage: () => void;
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
        <MyImage
          imageId={data.imageId}
          vertPosition={data.vertPosition}
          objectFit="cover"
        />
      ) : (
        <$Empty_ />
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
    toggleUseImage: () => void;
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
    {data.isUsingImage ? (
      <>
        <ContentMenu.VerticalBar />
        <ToggleUseImageButton_ toggleUseImage={actions.toggleUseImage} />
      </>
    ) : null}
  </ContentMenu>
);
