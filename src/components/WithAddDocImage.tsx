import { ReactElement, useState } from "react";
import tw, { css } from "twin.macro";
import { FileImage, Upload as UploadIcon, X } from "phosphor-react";
import { Dialog } from "@headlessui/react";

import useToggle from "^hooks/useToggle";

import WithProximityPopover from "^components/WithProximityPopover";
import WithTooltip from "./WithTooltip";
import WithUploadImage from "./WithUploadImage";
import UploadedImages from "./images/Uploaded";
import Filter, { UsedTypeFilter } from "./images/Filter";

import { s_editorMenu } from "^styles/menus";
import s_button from "^styles/button";

type OnAddImage = (imageId: string) => void;

const WithAddDocImage = ({
  children,
  isDisabled = false,
  onAddImage,
}: {
  children: ReactElement;
  isDisabled?: boolean;
  onAddImage: OnAddImage;
}) => {
  const [
    uploadedImagesDialogisOpen,
    openUploadedImagesPanel,
    closeUploadedImagesPanel,
  ] = useToggle();

  type OnAddImageParam = Parameters<OnAddImage>[0];

  const handleOnAddImage = (arg: OnAddImageParam) => {
    onAddImage(arg);
  };

  const handleUploadedImagesAddImage = (arg: OnAddImageParam) => {
    handleOnAddImage(arg);
    closeUploadedImagesPanel();
  };

  return (
    <>
      <WithProximityPopover
        isDisabled={isDisabled}
        panel={
          <ImageTypeMenu
            openPanel={openUploadedImagesPanel}
            onAddImage={handleOnAddImage}
          />
        }
      >
        {children}
      </WithProximityPopover>
      <UploadedImagesDialog
        isOpen={uploadedImagesDialogisOpen}
        closePanel={closeUploadedImagesPanel}
        onAddImage={handleUploadedImagesAddImage}
      />
    </>
  );
};

export default WithAddDocImage;

const ImageTypeMenu = ({
  openPanel,
  onAddImage,
}: {
  openPanel: () => void;
  onAddImage: OnAddImage;
}) => {
  return (
    <>
      <div css={[s_menu.container]}>
        <UploadedImagesButton onClick={openPanel} />
        <Upload onAddImage={onAddImage} />
      </div>
    </>
  );
};

const s_menu = {
  container: tw`absolute top-0 right-0 z-30 px-sm py-xs inline-flex items-center gap-sm bg-white rounded-md shadow-md border`,
  button: css`
    ${s_editorMenu.button.button} ${tw`text-[15px]`}
  `,
};

const Upload = ({ onAddImage }: { onAddImage: OnAddImage }) => {
  return (
    <WithUploadImage onUploadImage={({ id }) => onAddImage(id)}>
      <button
        // todo: isn't turning to cursor pointer for some reason
        css={[s_menu.button]}
        type="button"
      >
        <UploadIcon />
      </button>
    </WithUploadImage>
  );
};

const UploadedImagesButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <WithTooltip text="use uploaded">
      <button onClick={onClick} css={[s_menu.button]} type="button">
        <FileImage />
      </button>
    </WithTooltip>
  );
};

const UploadedImagesDialog = ({
  isOpen,
  closePanel,
  onAddImage,
}: {
  isOpen: boolean;
  closePanel: () => void;
  onAddImage: OnAddImage;
}) => {
  return (
    <Dialog css={[tw`z-50`]} onClose={closePanel} open={isOpen}>
      <UploadedImagesPanel closePanel={closePanel} onAddImage={onAddImage} />
      <div css={[tw`fixed inset-0 z-40 bg-overlayDark`]} aria-hidden="true" />
    </Dialog>
  );
};

const UploadedImagesPanel = ({
  closePanel,
  onAddImage,
}: {
  closePanel: () => void;
  onAddImage: OnAddImage;
}) => {
  const [usedType, setUsedType] = useState<UsedTypeFilter>("all");
  const [keywordInputValue, setKeywordInputValue] = useState("");

  return (
    <Dialog.Panel
      as="div"
      css={[
        tw`z-50 p-lg bg-white fixed inset-lg rounded-md flex flex-col justify-between`,
      ]}
    >
      <WithTooltip text="close">
        <button
          css={[
            s_button.icon,
            s_button.selectors,
            tw`absolute right-1 top-1 text-xl`,
          ]}
          onClick={closePanel}
          type="button"
        >
          <X weight="bold" />
        </button>
      </WithTooltip>
      <div>
        <h1 css={[tw`text-2xl font-medium`]}>Images</h1>
        <div css={[tw`mt-md`]}>
          <Filter
            keywordInputValue={keywordInputValue}
            setKeywordInputValue={setKeywordInputValue}
            setUsedType={setUsedType}
            usedType={usedType}
          />
        </div>
        <div css={[tw`mt-sm`]}>
          <UploadedImages
            usedType={usedType}
            keywordQuery={keywordInputValue}
            addImageToDoc={({ id }) => onAddImage(id)}
          />
        </div>
      </div>
      <div css={[tw`flex justify-end`]}>
        <button css={[s_button.panel]} onClick={closePanel} type="button">
          cancel
        </button>
      </div>
    </Dialog.Panel>
  );
};
