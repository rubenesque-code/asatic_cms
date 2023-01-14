import { ReactElement } from "react";
import tw from "twin.macro";

import ContainerUtility from "^components/ContainerUtilities";
import { ImageIcon } from "^components/Icons";
import MyImage from "^components/images/MyImage";
import ContentMenu from "^components/menus/Content";
import {
  ToggleUseImageButton_,
  UpdateImageSrcButton_,
  UpdateImageVertPositionButtons_,
} from "^components/pages/curated/_containers/ImageMenu_";
import { $imageContainer } from "../../_styles/$summary";

export const Image_ = ({
  actions,
  data,
  children,
}: {
  data: {
    imageId?: string | null;
    isUsingImage?: boolean;
    vertPosition: number;
  };
  actions: {
    toggleUseImage?: (() => void) | null;
    updateVertPosition: (vertPosition: number) => void;
    updateImageSrc: (imageId: string) => void;
  };
  children?: ReactElement | null;
}) => {
  if (!data.isUsingImage) {
    return null;
  }

  return (
    <ContainerUtility.isHovered styles={$imageContainer}>
      {(containerIsHovered) => (
        <>
          {children ? (
            children
          ) : data.imageId ? (
            <MyImage
              imageId={data.imageId}
              vertPosition={data.vertPosition}
              objectFit="cover"
            />
          ) : (
            <$Empty_ isToggleable={Boolean(actions.toggleUseImage)} />
          )}
          <ImageMenu_
            isShowing={containerIsHovered}
            actions={actions}
            data={{
              isImage: Boolean(data.imageId),
              vertPosition: data.vertPosition,
              isUsingImage: data.isUsingImage,
            }}
          />
        </>
      )}
    </ContainerUtility.isHovered>
  );
};

const ImageMenu_ = ({
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
    toggleUseImage?: (() => void) | null;
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

const $Empty_ = ({ isToggleable }: { isToggleable?: boolean }) => (
  <div
    css={[tw`aspect-ratio[16 / 9] grid place-items-center border font-sans`]}
  >
    <div css={[tw`flex flex-col items-center`]}>
      <span css={[tw`text-2xl text-gray-400`]}>
        <ImageIcon weight="thin" />
      </span>
      <p css={[tw`text-gray-500 text-sm mt-xxs text-center px-sm`]}>
        Add image.
        {isToggleable && " You can add one or remove this image section."}
      </p>
    </div>
  </div>
);
