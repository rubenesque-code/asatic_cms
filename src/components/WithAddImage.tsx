import { FileImage, Upload as UploadIcon } from "phosphor-react";
import { ChangeEvent, ReactElement, useRef } from "react";
import NextImage from "next/image";
import tw from "twin.macro";
import { v4 as generateUId } from "uuid";
import { toast } from "react-toastify";

import {
  useFetchImagesQuery,
  useUploadImageAndCreateImageDocMutation,
} from "^redux/services/images";

import WithProximityPopover from "^components/WithProximityPopover";
import WithTooltip from "./WithTooltip";

import s_button from "^styles/button";

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

const ImageTypeMenu = ({ onAddImage: onSelectImage }: PassedProps) => {
  return (
    <div css={[tw`flex items-center gap-sm p-sm`]}>
      <UploadImagesPopover />
      <Upload onAddImage={onSelectImage} />
    </div>
  );
};

const Upload = ({ onAddImage: onSelectImage }: PassedProps) => {
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
      onSelectImage(data);
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

const UploadImagesPopover = () => {
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

const UploadedImagesPanel = () => {
  const { data: images, isLoading } = useFetchImagesQuery();
  console.log(images);

  if (isLoading) {
    return <div css={[tw`p-lg bg-white`]}>Loading images...</div>;
  }

  return (
    <div css={[tw`p-lg bg-white w-[70vw]`]}>
      {images!.length ? (
        <div css={[tw`grid grid-cols-4 gap-sm`]}>
          {images!.map((image) => (
            <div css={[tw`relative border aspect-ratio[4/3]`]} key={image.id}>
              <NextImage src={image.URL} layout="fill" objectFit="contain" />
            </div>
          ))}
        </div>
      ) : (
        <p>No images yet</p>
      )}
    </div>
  );
};
