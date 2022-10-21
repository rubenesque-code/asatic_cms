import { ComponentProps } from "react";
import tw, { TwStyle } from "twin.macro";

import MyImage from "^components/images/MyImage";
import ContentMenu from "^components/menus/Content";
import ImageMenuButtons from "^components/display-entity/image/MenuButtons";
import ContainerUtility from "^components/ContainerUtilities";
import { MyOmit } from "^types/utilities";

type ImageButtonsProps = ComponentProps<typeof ImageMenuButtons>;

const Image_ = ({
  imageId,
  menuContainerStyles,
  ...menuProps
}: {
  imageId: string;
  vertPosition: number;
  menuContainerStyles: TwStyle;
} & MyOmit<MenuProps, "containerStyles">) => {
  const { vertPosition } = menuProps;
  return (
    <ContainerUtility.isHovered styles={tw`relative h-full`}>
      {(isHovered) => (
        <>
          <MyImage
            imageId={imageId}
            objectFit="cover"
            vertPosition={vertPosition}
          />
          <Menu
            isShowing={isHovered}
            {...menuProps}
            containerStyles={menuContainerStyles}
          />
        </>
      )}
    </ContainerUtility.isHovered>
  );
};

export default Image_;

type MenuProps = {
  containerStyles?: TwStyle;
} & ImageButtonsProps;

const Menu = ({
  isShowing,
  containerStyles = tw`absolute right-0 top-0`,
  ...imageButtonsProps
}: {
  isShowing: boolean;
} & MenuProps) => {
  return (
    <ContentMenu show={isShowing} styles={containerStyles}>
      <ImageMenuButtons {...imageButtonsProps} />
    </ContentMenu>
  );
};
