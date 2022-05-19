import { FileImage, Upload as UploadIcon } from "phosphor-react";
import { ChangeEvent, ReactElement } from "react";
import tw from "twin.macro";
import NextImage from "next/image";

import WithProximityPopover from "^components/WithProximityPopover";
import {
  useFetchImagesQuery,
  useUploadImageAndCreateImageDocMutation,
} from "^redux/services/images";
import s_button from "^styles/button";
import WithTooltip from "./WithTooltip";
import { toast } from "react-toastify";

type PassedProps = {
  onSelectImage: (URL: string) => void;
};

const WithSelectImage = ({
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

export default WithSelectImage;

const ImageTypeMenu = ({ onSelectImage }: PassedProps) => {
  return (
    <div css={[tw`flex items-center gap-sm p-sm`]}>
      <UploadImagesPopover />
      <Upload onSelectImage={onSelectImage} />
    </div>
  );
};

const UPLOADID = "image-upload";

const Upload = ({ onSelectImage }: PassedProps) => {
  const [uploadImageAndCreateImageDoc] =
    useUploadImageAndCreateImageDocMutation();

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
      const { URL } = uploadRes.data;
      onSelectImage(URL);
      toast.info("Image added to article.");
    }
  };

  return (
    <>
      <label
        css={[s_button.icon, s_button.selectors, tw`cursor-pointer `]}
        htmlFor={UPLOADID}
      >
        <WithTooltip text="upload new">
          <UploadIcon />
        </WithTooltip>
      </label>
      <input
        css={[tw`hidden`]}
        accept="image/*"
        onChange={handleFileUpload}
        id={UPLOADID}
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
