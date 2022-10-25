import { ReactElement } from "react";
import tw, { TwStyle } from "twin.macro";

import ContainerUtility from "^components/ContainerUtilities";
import { ImageIcon } from "^components/Icons";

export const $Container_ = ({
  children,
  menu,
  styles = tw`relative h-full`,
}: {
  children: ReactElement | ReactElement[];
  menu: (isHovered: boolean) => ReactElement;
  styles?: TwStyle;
}) => {
  return (
    <ContainerUtility.isHovered styles={styles}>
      {(isHovered) => (
        <>
          {children}
          {menu(isHovered)}
        </>
      )}
    </ContainerUtility.isHovered>
  );
};

export const $Empty_ = () => (
  <div css={[tw`aspect-ratio[16/9] grid place-items-center border`]}>
    <div css={[tw`flex flex-col items-center`]}>
      <span css={[tw`text-2xl text-gray-400`]}>
        <ImageIcon weight="thin" />
      </span>
      <p css={[tw`text-gray-500 text-sm mt-xxs text-center px-sm`]}>
        No image.
      </p>
    </div>
  </div>
);
