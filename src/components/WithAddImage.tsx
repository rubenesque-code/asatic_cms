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

import { useUploadImageAndCreateImageDocMutation } from "^redux/services/images";

import { useDispatch, useSelector } from "^redux/hooks";
import { selectAll, removeOne } from "^redux/state/images";

import WithProximityPopover from "^components/WithProximityPopover";
import WithTooltip from "./WithTooltip";

import s_button from "^styles/button";
import useHovered from "^hooks/useHovered";
import { Image } from "^types/image";
import WithWarning from "./WithWarning";
import useToggle from "^hooks/useToggle";

// todo: seervice for delete image
// todo: styling of image menus
// todo: info for type of images accepted

type PassedProps = {
  onAddImage: ({ id, URL }: { id: string; URL: string }) => void;
};

const WithAddImage = ({
  children,
  ...passedProps
}: { children: ReactElement } & PassedProps) => {
  const [isOpen, openPanel, closePanel] = useToggle();
  return (
    <>
      <WithProximityPopover
        panelContentElement={
          <ImageTypeMenu openPanel={openPanel} {...passedProps} />
        }
      >
        {children}
      </WithProximityPopover>
      <UploadedImagesDialog
        isOpen={isOpen}
        closePanel={closePanel}
        {...passedProps}
      />
    </>
  );
};

export default WithAddImage;

const ImageTypeMenu = ({
  openPanel,
  ...passedProps
}: { openPanel: () => void } & PassedProps) => {
  return (
    <>
      <div css={[tw`flex items-center gap-sm p-sm`]}>
        <UploadedImagesButton onClick={openPanel} />
        <Upload {...passedProps} />
      </div>
    </>
  );
};

const Upload = ({ onAddImage }: PassedProps) => {
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
      toast.info("Image added to article.");
    }
  };

  return (
    <>
      <label
        css={[s_button.icon, s_button.selectors, tw`cursor-pointer`]}
        htmlFor={uploadInputId}
      >
        <WithTooltip text="upload new">
          <UploadIcon />
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
        css={[s_button.icon, s_button.selectors]}
        type="button"
      >
        <FileImage />
      </button>
    </WithTooltip>
  );
};

const UploadedImagesDialog = ({
  isOpen,
  closePanel,
  ...passedProps
}: { isOpen: boolean; closePanel: () => void } & PassedProps) => {
  return (
    <Dialog onClose={closePanel} open={isOpen}>
      <UploadedImagesPanel closePanel={closePanel} {...passedProps} />
      <div css={[tw`fixed inset-0 z-40 bg-overlayDark`]} aria-hidden="true" />
    </Dialog>
  );
};

// todo: popopover overlay not working for below; possibly because it's a popover within a popover
// todo: should place in center of screen rather than use proximity?. If using proximity, needs to be scrollable
const UploadedImagesPanel = ({
  closePanel,
  ...passedProps
}: { closePanel: () => void } & PassedProps) => {
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
      <div css={[tw`flex-grow overflow-y-scroll overflow-x-hidden p-sm`]}>
        {images!.length ? (
          <div css={[tw`grid grid-cols-4 gap-sm`]}>
            {images!.map((image) => (
              <UploadedImage image={image} {...passedProps} key={image.id} />
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
}: { image: Image } & PassedProps) => {
  const dispatch = useDispatch();
  // * was a bug using tailwind's group hover functionality so using the below
  const [containerIsHovered, containerHoverHandlers] = useHovered();
  const [imageIsHovered, imageHoverHandlers] = useHovered();

  const imageIsUsed = image.relatedArticleIds?.length;

  const handleDeleteImage = () =>
    imageIsUsed && dispatch(removeOne({ id: image.id }));

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
          onClick={() => onAddImage({ id: image.id, URL: image.URL })}
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
