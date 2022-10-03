import tw, { css, styled } from "twin.macro";

export const BannerContainer = tw.div`relative h-[600px]`;

export const backgroundStyle = tw`bg-white bg-opacity-80`;

export const DescriptionContainer = styled.div`
  ${css`
    ${tw`z-10 absolute top-md left-lg bottom-md w-[500px] p-md`}
    ${backgroundStyle}
  `}
`;

export const DocTypeHeading = tw.h3`uppercase text-sm tracking-wide font-sans`;

export const Title = tw.h1`text-4xl font-serif-eng`;

export const DescriptionText = tw.div`text-base mt-sm`;
