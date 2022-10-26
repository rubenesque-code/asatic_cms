import { ReactElement } from "react";
import tw from "twin.macro";

import ContainerUtility from "^components/ContainerUtilities";
import { ImageIcon } from "^components/Icons";

export const $ImageContainer_ = ({
  children,
}: {
  children: (isHovered: boolean) => ReactElement;
}) => {
  return (
    <ContainerUtility.isHovered styles={tw`relative mb-xs`}>
      {(isHovered) => children(isHovered)}
    </ContainerUtility.isHovered>
  );
};

export const $ImageEmpty_ = ({
  entityType,
  imageIsRemovable,
}: {
  entityType: string;
  imageIsRemovable?: boolean;
}) => (
  <div css={[tw`aspect-ratio[16/9] grid place-items-center border`]}>
    <div css={[tw`flex flex-col items-center`]}>
      <span css={[tw`text-3xl text-gray-400`]}>
        <ImageIcon weight="thin" />
      </span>
      <h4 css={[tw`text-gray-700 text-sm mt-xs`]}>Image section</h4>
      <p css={[tw`text-gray-400 text-sm mt-xxs text-center px-sm`]}>
        This {entityType} has no image.{" "}
        {imageIsRemovable
          ? "You can add one or remove this image section."
          : null}
      </p>
    </div>
  </div>
);
