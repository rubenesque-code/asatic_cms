import { ReactElement } from "react";
import tw from "twin.macro";

import ContainerUtility from "^components/ContainerUtilities";
import { ImageIcon } from "^components/Icons";

export const $ImageSectionContainer_ = ({
  children,
  menu,
}: {
  children: ReactElement | ReactElement[];
  menu: (isHovered: boolean) => ReactElement;
}) => {
  return (
    <ContainerUtility.isHovered styles={tw`relative`}>
      {(isHovered) => (
        <>
          {children}
          {menu(isHovered)}
        </>
      )}
    </ContainerUtility.isHovered>
  );
};

export const $ImageSectionEmpty_ = () => (
  <div css={[tw`aspect-ratio[16/9] grid place-items-center border`]}>
    <div css={[tw`flex flex-col items-center`]}>
      <span css={[tw`text-3xl text-gray-400`]}>
        <ImageIcon weight="thin" />
      </span>
      <h4 css={[tw`text-gray-700 text-sm mt-xs`]}>Image section</h4>
      <p css={[tw`text-gray-400 text-sm mt-xxs text-center px-sm`]}>
        This image section has no image.
      </p>
    </div>
  </div>
);
