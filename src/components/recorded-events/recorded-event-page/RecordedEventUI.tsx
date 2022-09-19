import { Plus, YoutubeLogo } from "phosphor-react";
import { ComponentProps, ReactElement } from "react";
import tw from "twin.macro";
import ContainerUtility from "^components/ContainerUtilities";
import ContentMenu from "^components/menus/Content";
import WithAddYoutubeVideo from "^components/WithAddYoutubeVideo";
import { MyOmit } from "^types/utilities";

export default function RecordedEventUI({
  children,
}: {
  children: ReactElement;
}) {
  return (
    <article css={[tw`h-full flex flex-col font-serif-eng`]}>
      {children}
    </article>
  );
}

RecordedEventUI.Header = tw.div`flex flex-col items-start gap-sm pt-lg pb-md border-b`;

RecordedEventUI.RecordedEventTitle = tw.div`uppercase text-blue-800 text-base tracking-wider`;

RecordedEventUI.Title = tw.div`text-3xl font-serif-eng font-medium`;

RecordedEventUI.Authors = tw.div`text-xl font-serif-eng`;

RecordedEventUI.Body = tw.div`flex flex-col flex-grow`;

RecordedEventUI.VideoSection = tw.div`py-lg border-t border-b border-gray-200`;

RecordedEventUI.VideoEmpty = function VideoEmpty({
  addYoutubeVideoProps,
}: {
  addYoutubeVideoProps: MyOmit<
    ComponentProps<typeof WithAddYoutubeVideo>,
    "children"
  >;
}) {
  return (
    <div css={[tw`grid place-items-center aspect-ratio[16 / 9]`]}>
      <div css={[tw`grid place-items-center`]}>
        <p css={[tw`text-gray-600 font-medium`]}>No video yet</p>
        <div css={[tw`mt-md`]}>
          <WithAddYoutubeVideo {...addYoutubeVideoProps}>
            <button
              css={[
                tw`flex items-center gap-xs py-1 px-3 rounded-md font-medium text-white bg-yellow-400 text-sm`,
              ]}
              type="button"
            >
              <span>
                <Plus weight="bold" />
              </span>
              <span>Add Video</span>
            </button>
          </WithAddYoutubeVideo>
        </div>
      </div>
    </div>
  );
};

RecordedEventUI.VideoContainer = function Video({
  children,
}: {
  children: (isHovered: boolean) => ReactElement;
}) {
  return (
    <ContainerUtility.isHovered styles={tw`relative `}>
      {(isHovered) => children(isHovered)}
    </ContainerUtility.isHovered>
  );
};

RecordedEventUI.VideoMenu = function VideoMenu({
  addYoutubeVideoProps,
  isShowing,
}: {
  addYoutubeVideoProps: MyOmit<
    ComponentProps<typeof WithAddYoutubeVideo>,
    "children"
  >;
  isShowing: boolean;
}) {
  return (
    <ContentMenu show={isShowing} styles={tw`absolute top-0 right-0`}>
      <WithAddYoutubeVideo {...addYoutubeVideoProps}>
        <ContentMenu.Button tooltipProps={{ text: "change video" }}>
          <YoutubeLogo />
        </ContentMenu.Button>
      </WithAddYoutubeVideo>
    </ContentMenu>
  );
};

RecordedEventUI.Video = function Video({ src }: { src: string }) {
  return (
    <ContainerUtility.Width>
      {(width) => (
        <iframe
          width={width}
          height={(width * 9) / 16}
          src={src}
          frameBorder="0"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
    </ContainerUtility.Width>
  );
};

RecordedEventUI.ArticleBody = tw.div``;
