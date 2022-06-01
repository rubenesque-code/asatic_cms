import { ChangeEvent, ReactElement, useRef } from "react";
import NextImage from "next/image";
import tw from "twin.macro";
import {
  FileImage,
  Info,
  Trash,
  Upload as UploadIcon,
  X,
} from "phosphor-react";
import { v4 as generateUId } from "uuid";
import { toast } from "react-toastify";
import { Dialog } from "@headlessui/react";

import {
  useDeleteUploadedImageMutation,
  useUploadImageAndCreateImageDocMutation,
} from "^redux/services/images";

import { useSelector } from "^redux/hooks";
import { selectAll } from "^redux/state/images";

import WithProximityPopover from "^components/WithProximityPopover";
import WithTooltip from "./WithTooltip";

import useHovered from "^hooks/useHovered";
import useToggle from "^hooks/useToggle";

import { Image } from "^types/image";

import WithWarning from "^components/WithWarning";

import { s_editorMenu } from "^styles/menus";
import s_button from "^styles/button";

type OnAddImage = ({ id, URL }: { id: string; URL: string }) => void;

const WithAddImage = ({
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
    toast.info("Image added to article");
  };

  const handleUploadedImagesAddImage = (arg: OnAddImageParam) => {
    handleOnAddImage(arg);
    closeUploadedImagesPanel();
  };

  return (
    <>
      <WithProximityPopover
        isDisabled={isDisabled}
        panelContentElement={
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

export default WithAddImage;

const ImageTypeMenu = ({
  openPanel,
  onAddImage,
}: {
  openPanel: () => void;
  onAddImage: OnAddImage;
}) => {
  return (
    <>
      <div css={[s_editorMenu.menu, tw`gap-sm`]}>
        <UploadedImagesButton onClick={openPanel} />
        <Upload onAddImage={onAddImage} />
      </div>
    </>
  );
};

const Upload = ({ onAddImage }: { onAddImage: OnAddImage }) => {
  const [uploadImageAndCreateImageDoc] =
    useUploadImageAndCreateImageDocMutation();

  const uploadInputRef = useRef(generateUId());
  const uploadInputId = uploadInputRef.current;

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const files = e.target.files;

    if (!files) {
      toast.error("No file selected.");
      return;
    }

    const file = files[0];
    const isImage = file.name.match(/.(jpg|jpeg|png|webp|avif|gif|tiff)$/i);

    if (!isImage) {
      toast.error("Invalid file (needs to be an image).");
      return;
    }

    const isAcceptedImage = file.name.match(/.(jpg|jpeg|png|webp)$/i);

    if (!isAcceptedImage) {
      toast.error(
        "Invalid image type. Needs to be of type .jpg, .jpeg, .png or .webp",
        {
          autoClose: 10000,
        }
      );
      return;
    }

    const uploadRes = await toast.promise(uploadImageAndCreateImageDoc(file), {
      pending: "Uploading...",
      success: "Uploaded",
      error: "Upload error",
    });

    if ("data" in uploadRes) {
      const { data } = uploadRes;
      onAddImage(data);
    }
  };

  return (
    <>
      <label
        css={[s_editorMenu.button.button, tw`cursor-pointer`]}
        htmlFor={uploadInputId}
      >
        <WithTooltip
          text={
            <div>
              <div>
                <h5 css={[tw`font-semibold`]}>Upload new</h5>
              </div>
              <div>
                <p>Accepted image types: .png, .jpg, .jpeg, .webp</p>
              </div>
            </div>
          }
          yOffset={13}
        >
          <UploadIcon weight="bold" />
        </WithTooltip>
      </label>
      <input
        css={[tw`hidden`]}
        accept="image/png, image/jpg, image/jpeg, image/webp"
        onChange={handleFileUpload}
        id={uploadInputId}
        name="files"
        type="file"
      />
    </>
  );
};

const UploadedImagesButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <WithTooltip text="use uploaded">
      <button
        onClick={onClick}
        css={[s_editorMenu.button.button]}
        type="button"
      >
        <FileImage weight="bold" />
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

// todo: popopover overlay not working for below; possibly because it's a popover within a popover
// todo: should place in center of screen rather than use proximity?. If using proximity, needs to be scrollable
const UploadedImagesPanel = ({
  closePanel,
  onAddImage,
}: {
  closePanel: () => void;
  onAddImage: OnAddImage;
}) => {
  const images = useSelector(selectAll);

  return (
    <Dialog.Panel
      css={[
        tw`z-50 p-lg bg-white fixed inset-lg rounded-md flex flex-col gap-md`,
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
      <header>
        <Dialog.Title>Choose from uploaded images</Dialog.Title>
      </header>
      <div css={[tw`flex-grow overflow-y-auto overflow-x-hidden px-sm py-lg`]}>
        {images!.length ? (
          <div css={[tw`grid grid-cols-4 gap-sm`]}>
            {images!.map((image) => (
              <UploadedImage
                image={image}
                onAddImage={onAddImage}
                key={image.id}
              />
            ))}
          </div>
        ) : (
          <p>No images yet</p>
        )}
      </div>
      <div css={[tw`flex justify-end`]}>
        <button css={[s_button.panel]} onClick={closePanel} type="button">
          cancel
        </button>
      </div>
    </Dialog.Panel>
  );
};

const UploadedImage = ({
  image,
  onAddImage,
}: {
  image: Image;
  onAddImage: OnAddImage;
}) => {
  // * was a bug using tailwind's group hover functionality so using the below
  const [containerIsHovered, containerHoverHandlers] = useHovered();
  const [imageIsHovered, imageHoverHandlers] = useHovered();

  const [deleteUploadedImage] = useDeleteUploadedImageMutation();
  const imageIsUsed = image.relatedArticleIds?.length;

  const handleDeleteImage = async () => {
    if (imageIsUsed) {
      return;
    }

    await toast.promise(deleteUploadedImage(image.id), {
      pending: "Deleting...",
      success: "Deleted",
      error: "Delete error",
    });
  };

  return (
    <div
      css={[
        tw`relative border aspect-ratio[4/3]`,
        imageIsHovered && tw`hover:scale-105 z-50`,
        tw`transition-transform ease-in-out duration-75`,
      ]}
      {...containerHoverHandlers}
      key={image.id}
    >
      <WithTooltip text="Click to add image to the document">
        <span
          css={[tw`cursor-pointer`]}
          onClick={() => {
            onAddImage({ id: image.id, URL: image.URL });
          }}
          {...imageHoverHandlers}
        >
          <NextImage
            src={image.URL}
            placeholder="blur"
            blurDataURL={image.blurURL}
            layout="fill"
            objectFit="contain"
          />
        </span>
      </WithTooltip>
      {!imageIsUsed ? (
        <WithTooltip
          text="this image is unused in any document and can safely be deleted."
          yOffset={10}
        >
          <span
            css={[tw`absolute text-lg text-blue-600 rounded-full bg-white `]}
          >
            <Info weight="bold" />
          </span>
        </WithTooltip>
      ) : null}
      {!imageIsUsed ? (
        <WithWarning
          warningText={{ heading: "Delete image?" }}
          callbackToConfirm={handleDeleteImage}
        >
          <WithTooltip text="delete image">
            <button
              css={[
                s_button.icon,
                // s_button.selectors,
                tw`hover:text-red-warning hover:scale-125`,
                tw`absolute right-0 translate-x-1/4 -translate-y-1/4 shadow-lg text-base`,
                containerIsHovered
                  ? tw`opacity-100 visible`
                  : tw`opacity-0 invisible`,
                tw`transition-all ease-in-out duration-75`,
              ]}
              type="button"
            >
              <Trash />
            </button>
          </WithTooltip>
        </WithWarning>
      ) : null}
    </div>
  );
};
