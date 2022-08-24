import { ComponentProps, ReactElement } from "react";
import tw from "twin.macro";
import Image from "^components/images/Image";
import ImageWrapper from "^components/images/Wrapper";
import { MyOmit } from "^types/utilities";

export default function CollectionUI({ children }: { children: ReactElement }) {
  return <div css={[tw`h-full flex flex-col`]}>{children}</div>;
}

// banner: image, 'COLLECTION', title, description
// banner-card container...

CollectionUI.Banner = tw.div`relative h-2/5`;

CollectionUI.BannerImage = function Image({
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

CollectionUI.NoImage = tw.div`h-full grid place-items-center border`;

CollectionUI.AddImageButton = tw.button`border rounded-md uppercase flex items-center gap-sm text-sm py-1 px-3 text-gray-700`;

type ImageMenuProps = MyOmit<
  ComponentProps<typeof Image.Menu>,
  "additionalButtons"
>;

CollectionUI.ImageMenu = function ImageMenu(props: ImageMenuProps) {
  return <Image.Menu containerStyles={tw`absolute top-0 right-0`} {...props} />;
};

CollectionUI.DescriptionCard = tw.div`bg-white px-md py-xl text-articleText font-serif-eng`;

CollectionUI.CollectionText = tw.h2`uppercase text-sm tracking-wide font-sans`;

CollectionUI.Title = tw.div`text-xl`;

CollectionUI.DescriptionText = tw.div`text-base mt-md`;
