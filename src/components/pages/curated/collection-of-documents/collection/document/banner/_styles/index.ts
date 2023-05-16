import tw, { css, styled } from "twin.macro";

export const $BannerContainer = tw.div`relative h-[600px]`;

export const $metaContainerBackgroundStyle = tw`bg-white bg-opacity-80`;

export const $MetaContainer = styled.div`
  ${css`
    ${tw`z-10 absolute top-md left-lg bottom-md w-[500px] p-md`}
    ${$metaContainerBackgroundStyle}
  `}
`;

export const $EntityTypeHeading = tw.h3`uppercase text-sm tracking-wider font-sans text-gray-700`;

export const $MetaTitle = tw.h1`text-4xl font-serif-eng mt-xxxs text-gray-800`;

export const $MetaText = tw.div`text-base mt-sm`;
