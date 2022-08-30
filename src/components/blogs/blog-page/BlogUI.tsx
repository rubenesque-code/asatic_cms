import { Trash } from "phosphor-react";
import { ReactElement } from "react";
import tw from "twin.macro";
import ContainerUtility from "^components/ContainerUtilities";
import ContentMenu from "^components/menus/Content";
import VideoIFrame from "^components/video/IFrame";

export default function BlogUI({ children }: { children: ReactElement }) {
  return (
    <article css={[tw`h-full flex flex-col font-serif-eng`]}>
      {children}
    </article>
  );
}

BlogUI.Header = tw.div`flex flex-col items-start gap-sm pt-lg pb-md border-b`;

BlogUI.Title = tw.div`text-3xl font-medium`;

BlogUI.Authors = tw.div`text-xl`;

BlogUI.Body = tw.div`flex flex-col flex-grow`;

BlogUI.SectionMenu = function SectionMenu({
  children: moreButtons,
  deleteSection,
  show,
}: {
  children?: ReactElement | ReactElement[];
  deleteSection: () => void;
  show: boolean;
}) {
  return (
    <ContentMenu styles={tw`top-0 right-0`} show={show}>
      <>
        {moreButtons}
        <ContentMenu.ButtonWithWarning
          warningProps={{
            callbackToConfirm: deleteSection,
            warningText: "delete section?",
            type: "moderate",
          }}
          tooltipProps={{ text: "delete section", type: "action" }}
        >
          <Trash />
        </ContentMenu.ButtonWithWarning>
      </>
    </ContentMenu>
  );
};

BlogUI.TextSection = tw.div`relative`;

BlogUI.ImageSectionEmpty = function ImageEmpty({
  children: addImageButton,
}: {
  children: ReactElement;
}) {
  return (
    <div
      css={[
        tw`relative font-sans h-[200px] grid place-items-center border-2 border-dashed`,
      ]}
    >
      <div css={[tw`text-center`]}>
        <h4 css={[tw`font-medium`]}>Image section</h4>
        <p css={[tw`text-gray-700 text-sm mt-xs`]}>No image</p>
        <div css={[tw`mt-md`]}>{addImageButton}</div>
      </div>
    </div>
  );
};

BlogUI.ImageSection = tw.div`relative`;

BlogUI.ImageWrapper = tw.div`w-full h-full`;

BlogUI.ImageCaption = tw.div`mt-xs border-l border-gray-500 pl-xs text-gray-700`;

BlogUI.VideoSectionEmpty = function ImageEmpty({
  children: addVideoButton,
}: {
  children: ReactElement;
}) {
  return (
    <div
      css={[
        tw`relative font-sans h-[200px] grid place-items-center border-2 border-dashed`,
      ]}
    >
      <div css={[tw`text-center`]}>
        <h4 css={[tw`font-medium`]}>Video section</h4>
        <p css={[tw`text-gray-700 text-sm mt-xs`]}>No video</p>
        <div css={[tw`mt-md`]}>{addVideoButton}</div>
      </div>
    </div>
  );
};

BlogUI.VideoSection = tw.div`relative`;

BlogUI.Video = function Video({ src }: { src: string }) {
  return (
    <ContainerUtility.Width>
      {(width) => (
        <VideoIFrame height={(width * 9) / 16} src={src} width={width} />
      )}
    </ContainerUtility.Width>
  );
};
