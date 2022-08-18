import { ComponentProps, ReactElement } from "react";
import { PlayCircle } from "phosphor-react";
import tw from "twin.macro";

import { MyOmit } from "^types/utilities";

import ImageWrapper from "^components/images/Wrapper";
import Image from "^components/images/Image";
import MissingText from "^components/MissingText";

export default function RecordedEventUI({
  children,
}: {
  children: ReactElement | ReactElement[];
}) {
  return <div css={[tw`py-sm px-xs`]}>{children}</div>;
}

RecordedEventUI.ImageContainer = function Image({
  children,
}: {
  children: ReactElement;
}) {
  return (
    <div css={[tw`relative w-full aspect-ratio[16/ 9]`]}>
      {children}
      <div
        css={[tw`z-10 absolute bottom-sm right-sm text-3xl  text-blue-500 `]}
      >
        <PlayCircle weight="fill" />
      </div>
    </div>
  );
};

RecordedEventUI.NoVideo = function NoVideo() {
  return <div css={[tw`h-full grid place-items-center border`]}>No video</div>;
};

RecordedEventUI.YoutubeThumbnailImage = function ThumbnailImage({
  src,
  vertPosition,
}: {
  src: string;
  vertPosition: number;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      css={[tw`object-cover w-full h-full `]}
      src={src}
      style={{ objectPosition: `50% ${vertPosition}%` }}
      alt=""
    />
  );
};

RecordedEventUI.Image = function Image({
  imgId,
  vertPosition,
}: {
  imgId: string;
  vertPosition: number;
}) {
  return (
    <ImageWrapper imgId={imgId} objectFit="cover" vertPosition={vertPosition} />
  );
};

type ImageMenuProps = MyOmit<
  ComponentProps<typeof Image.Menu>,
  "additionalButtons"
>;

RecordedEventUI.ImageMenu = function ImageMenu(props: ImageMenuProps) {
  return <Image.Menu containerStyles={tw`absolute top-0 right-0`} {...props} />;
};

RecordedEventUI.BottomCard = function BottomCard({
  children,
}: {
  children: ReactElement | ReactElement[];
}) {
  return <div css={[tw`p-sm`]}>{children}</div>;
};

RecordedEventUI.Title = function Title({
  children,
}: {
  children: ReactElement | string;
}) {
  return <h2 css={[tw`text-2xl text-white`]}>{children}</h2>;
};

RecordedEventUI.MissingTitle = function MissingTitle() {
  return (
    <div css={[tw`flex items-baseline gap-xs`]}>
      <span css={[tw`text-gray-placeholder`]}>Title...</span>
      <MissingText tooltipText="missing title" fontSize={tw`text-base`} />
    </div>
  );
};

RecordedEventUI.Authors = function Authors({
  children,
}: {
  children: ReactElement;
}) {
  return <h3 css={[tw`text-xl text-white mt-xxxs`]}>{children}</h3>;
};
