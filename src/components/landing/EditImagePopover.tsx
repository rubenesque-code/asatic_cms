import { Image as ImageIcon } from "phosphor-react";
import { ContentMenuButton } from "^components/menus/Content";
import WithAddDocImage from "^components/WithAddDocImage";

const EditImagePopover = ({
  onSelectImage,
  tooltipText = "edit image",
}: {
  onSelectImage: (imageId: string) => void;
  tooltipText?: string;
}) => (
  <WithAddDocImage onAddImage={onSelectImage}>
    <ContentMenuButton tooltipProps={{ text: tooltipText }}>
      <ImageIcon />
    </ContentMenuButton>
  </WithAddDocImage>
);

export default EditImagePopover;
