import { Image as ImageIcon } from "phosphor-react";
import ContentMenu from "^components/menus/Content";
import WithAddDocImage from "^components/WithAddDocImage";

const EditImagePopover = ({
  onSelectImage,
  tooltipText = "edit image",
}: {
  onSelectImage: (imageId: string) => void;
  tooltipText?: string;
}) => (
  <WithAddDocImage onAddImage={onSelectImage}>
    <ContentMenu.Button tooltipProps={{ text: tooltipText }}>
      <ImageIcon />
    </ContentMenu.Button>
  </WithAddDocImage>
);

export default EditImagePopover;
