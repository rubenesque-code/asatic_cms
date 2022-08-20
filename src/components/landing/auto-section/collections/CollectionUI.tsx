import tw from "twin.macro";
import ImageWrapper from "^components/images/Wrapper";
import StatusLabel from "^components/StatusLabel";

import AutoSectionUI from "../AutoSectionUI";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function CollectionUI() {}

CollectionUI.Container = tw(AutoSectionUI.ItemContainer)`bg-white`;

CollectionUI.Menu = AutoSectionUI.ItemMenu;

CollectionUI.Status = function Status() {
  return (
    <StatusLabel
      publishDate={}
      includeNewType={false}
      status={}
      showPublished={false}
    />
  );
};

CollectionUI.ImageContainer = tw.div`relative w-full aspect-ratio[16/9] mb-xs`;

CollectionUI.Image = function Image({
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

CollectionUI.ImageMenu = AutoSectionUI.ItemImageMenu;

CollectionUI.NoImage = function NoImage() {
  return (
    <div css={[tw`h-full grid place-items-center`]}>
      <p css={[tw`font-sans text-gray-600`]}>No image</p>
    </div>
  );
};

CollectionUI.Subject = tw.h3`text-base uppercase text-articleText mb-xs`;

CollectionUI.Title = tw.h2`text-2xl text-articleText`;

CollectionUI.Summary = tw.div`text-base text-articleText mt-sm`;
