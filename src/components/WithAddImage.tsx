import { ChangeEvent, ReactElement, useRef } from "react";
import NextImage from "next/image";
import tw from "twin.macro";
import { FileImage, Info, Trash, Upload as UploadIcon } from "phosphor-react";
import { v4 as generateUId } from "uuid";
import { toast } from "react-toastify";

// todo: delete functionality - notify if used within an article: maybe deny delete if so

import {
  useFetchImagesQuery,
  useUploadImageAndCreateImageDocMutation,
} from "^redux/services/images";

import { useDispatch, useSelector } from "^redux/hooks";
import { selectAll, removeOne } from "^redux/state/images";

import WithProximityPopover from "^components/WithProximityPopover";
import WithTooltip from "./WithTooltip";

import s_button from "^styles/button";
import s_transition from "^styles/transition";
import useHovered from "^hooks/useHovered";
import { Image } from "^types/image";
import WithWarning from "./WithWarning";

type PassedProps = {
  onAddImage: ({ id, URL }: { id: string; URL: string }) => void;
};

const WithAddImage = ({
  children,
  ...passedProps
}: { children: ReactElement } & PassedProps) => {
  return (
    <WithProximityPopover
      panelContentElement={<ImageTypeMenu {...passedProps} />}
    >
      {children}
    </WithProximityPopover>
  );
};

export default WithAddImage;

const ImageTypeMenu = (passedProps: PassedProps) => {
  return (
    <div css={[tw`flex items-center gap-sm p-sm`]}>
      <UploadedImagesPopover />
      <Upload {...passedProps} />
    </div>
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
    const isImage = file.name.match(/.(jpg|jpeg|png|avif)$/i);

    if (!isImage) {
      toast.error("Invalid file (Needs to be an image).");
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
        // css={[tw`hidden`]}
        accept="image/*"
        onChange={handleFileUpload}
        id={uploadInputId}
        name="files"
        type="file"
      />
    </>
  );
};

const UploadedImagesPopover = () => {
  return (
    <WithProximityPopover panelContentElement={<UploadedImagesPanel />}>
      <WithTooltip text="use uploaded">
        <button css={[s_button.icon, s_button.selectors]} type="button">
          <FileImage />
        </button>
      </WithTooltip>
    </WithProximityPopover>
  );
};

// todo: popopover overlay not working for below; possibly because it's a popover within a popover
// todo: should place in center of screen rather than use proximity?. If using proximity, needs to be scrollable
const UploadedImagesPanel = () => {
  const images = useSelector(selectAll);

  // if (isLoading) {
  // return <div css={[tw`p-lg bg-white`]}>Loading images...</div>;
  // }

  return (
    <div css={[tw`p-lg bg-white w-[70vw]`]}>
      {images!.length ? (
        <div css={[tw`grid grid-cols-4 gap-sm`]}>
          {images!.map((image) => (
            <UploadedImage image={image} key={image.id} />
          ))}
        </div>
      ) : (
        <p>No images yet</p>
      )}
    </div>
  );
};

const UploadedImage = ({ image }: { image: Image }) => {
  const dispatch = useDispatch();
  const [isHovered, hoverHandlers] = useHovered();

  const imageIsUsed = image.relatedArticleIds?.length;

  const handleDeleteImage = () =>
    imageIsUsed && dispatch(removeOne({ id: image.id }));

  return (
    <div
      className="group"
      css={[tw`relative border aspect-ratio[4/3]`]}
      {...hoverHandlers}
      key={image.id}
    >
      <NextImage src={image.URL} layout="fill" objectFit="contain" />
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
                s_button.selectors,
                tw`absolute right-0 translate-x-1/4 -translate-y-1/4 shadow-lg text-base`,
                isHovered ? tw`opacity-100 visible` : tw`opacity-0 invisible`,
                tw`transition-opacity ease-in-out duration-75`,
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
