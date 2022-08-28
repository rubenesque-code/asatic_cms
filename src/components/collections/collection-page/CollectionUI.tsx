import { ComponentProps, ReactElement } from "react";
import tw from "twin.macro";
import Image from "^components/images/Image";
import MyImage from "^components/images/MyImage";
import MissingText from "^components/MissingText";
import { MyOmit } from "^types/utilities";

export default function CollectionUI({ children }: { children: ReactElement }) {
  return <div css={[tw`h-full flex flex-col`]}>{children}</div>;
}

// banner: image, 'COLLECTION', title, description
// banner-card container...

CollectionUI.Banner = tw.div`relative max-h-[600px] aspect-ratio[21/9] border`;

CollectionUI.BannerOverlay = tw.div`absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 max-h-[90%] overflow-hidden flex items-center`;

CollectionUI.BannerImage = function Image({
  imgId,
  vertPosition,
}: {
  imgId: string;
  vertPosition: number;
}) {
  return (
    <MyImage imgId={imgId} objectFit="cover" vertPosition={vertPosition} />
  );
};

CollectionUI.NoImage = tw.div`h-full grid place-items-center px-xl`;

CollectionUI.AddImageButton = tw.button`border rounded-md uppercase flex items-center gap-sm text-sm py-1 px-3 text-gray-700`;

type ImageMenuProps = MyOmit<
  ComponentProps<typeof Image.Menu>,
  "additionalButtons"
>;

CollectionUI.ImageMenu = function ImageMenu(props: ImageMenuProps) {
  return <Image.Menu containerStyles={tw`absolute top-0 right-0`} {...props} />;
};

CollectionUI.DescriptionCard = tw.div`w-1/2 min-w-[500px] flex flex-col bg-white px-md text-articleText font-serif-eng border`;
// CollectionUI.DescriptionCard = tw.div`absolute left-lg top-1/2 -translate-y-1/2 w-2/5 max-h-[90%] overflow-hidden flex flex-col bg-white px-md pt-xl text-articleText font-serif-eng border`;

CollectionUI.CollectionText = tw.h2`uppercase text-sm tracking-wide font-sans`;

CollectionUI.Title = tw.div`text-3xl`;

CollectionUI.DescriptionText = tw.div`text-base mt-sm`;

CollectionUI.DescriptionCardSpacer = tw.div`w-full h-xl bg-white `;

CollectionUI.List = tw.div`flex flex-col`;

CollectionUI.Item = tw.div`border py-sm px-xs`;

CollectionUI.ItemTitle = tw.div`text-2xl`;

CollectionUI.ItemTitleMissing = function MissingTitle() {
  return (
    <div css={[tw`flex items-baseline gap-xs`]}>
      <span css={[tw`text-gray-placeholder`]}>Title...</span>
      <MissingText tooltipText="missing title" fontSize={tw`text-base`} />
    </div>
  );
};

CollectionUI.ItemDate = tw.div`text-lg`;

CollectionUI.ItemAuthors = tw.div`text-lg`;

CollectionUI.ItemSummary = tw.div`text-base`;
