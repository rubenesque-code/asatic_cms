import MenuButtons_, {
  AddImageMenuButton,
  MenuButtonsProps,
} from "^components/display-entity/image/MenuButtons";
import ContentMenu from "^components/menus/Content";
import { MyOmit } from "^types/utilities";
import {
  DocumentBodySectionMenu_,
  DocumentBodySectionMenuProps,
} from "./DocumentBodySectionMenu_";

export const ImageSectionEmptyMenu_ = ({
  updateImageSrc,
  ...menuProps
}: {
  updateImageSrc: (imageId: string) => void;
} & Pick<
  DocumentBodySectionMenuProps,
  "isShowing" | "sectionIndex" | "sectionId"
>) => {
  return (
    <DocumentBodySectionMenu_ {...menuProps}>
      <AddImageMenuButton updateImageSrc={updateImageSrc} />
      <ContentMenu.VerticalBar />
    </DocumentBodySectionMenu_>
  );
};

type ImagePopulatedMenuProps = {
  imageButtonsProps: MenuButtonsProps;
  sectionMenuProps: MyOmit<DocumentBodySectionMenuProps, "children">;
};

export const ImageSectionPopulatedMenu_ = ({
  imageButtonsProps,
  sectionMenuProps,
}: ImagePopulatedMenuProps) => {
  return (
    <DocumentBodySectionMenu_ {...sectionMenuProps}>
      <MenuButtons_ {...imageButtonsProps} />
    </DocumentBodySectionMenu_>
  );
};
