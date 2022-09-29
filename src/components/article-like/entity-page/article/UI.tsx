import { ReactElement } from "react";
import tw from "twin.macro";

import ContainerUtility from "^components/ContainerUtilities";
import VideoIFrame from "^components/video/IFrame";

export default function ArticleUI({ children }: { children: ReactElement }) {
  return (
    <article css={[tw`h-full flex flex-col font-serif-eng`]}>
      {children}
    </article>
  );
}

ArticleUI.Header = tw.div`flex flex-col items-start gap-sm pt-lg pb-md border-b`;

ArticleUI.Title = tw.div`text-3xl font-medium`;

ArticleUI.Authors = tw.div`text-xl`;

ArticleUI.Body = tw.div`mt-md`;

ArticleUI.BodySection = tw.div``;

ArticleUI.TextSection = tw.div`relative`;

ArticleUI.SectionEmpty = function SectionEmpty({
  children: addContentButton,
  title,
}: {
  children: ReactElement;
  title: string;
}) {
  return (
    <div
      css={[
        tw`relative font-sans h-[150px] grid place-items-center border border-gray-200`,
      ]}
    >
      <h4 css={[tw`text-gray-300 absolute left-1 top-0.5 uppercase text-xs`]}>
        {title}
      </h4>
      <div>{addContentButton}</div>
    </div>
  );
};

ArticleUI.ImageSection = tw.div`relative`;

ArticleUI.ImageWrapper = tw.div`w-full h-full`;

ArticleUI.ImageCaption = tw.div`mt-xs border-l border-gray-500 pl-xs text-gray-700`;

ArticleUI.VideoSection = tw.div`relative`;

ArticleUI.Video = function Video({ src }: { src: string }) {
  return (
    <ContainerUtility.Width>
      {(width) => (
        <VideoIFrame height={(width * 9) / 16} src={src} width={width} />
      )}
    </ContainerUtility.Width>
  );
};
