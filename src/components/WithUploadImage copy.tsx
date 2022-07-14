import { ChangeEvent, ReactElement, useState } from "react";
import NextImage from "next/image";
import { FileImage } from "phosphor-react";
import tw from "twin.macro";
import { toast } from "react-toastify";

import { useUploadImageAndCreateImageDocMutation } from "^redux/services/images";

import { Image, ImageKeyword } from "^types/image";

import WithProximityPopover from "./WithProximityPopover";
import WithTooltip from "./WithTooltip";
import KeywordsDisplayUI from "./keywords/display";
import KeywordsInput from "./keywords/input";

import { s_popover } from "^styles/popover";
import s_button from "^styles/button";

const WithUploadImage = ({
  children,
  onUploadImage,
}: {
  children: ReactElement;
  onUploadImage?: (image: Image) => void;
}) => {
  return (
    <WithProximityPopover
      panelContentElement={({ close }) => (
        <UploadImagePanel closePanel={close} onUploadImage={onUploadImage} />
      )}
    >
      {children}
    </WithProximityPopover>
  );
};

export default WithUploadImage;

const UploadImagePanel = ({
  closePanel,
  onUploadImage,
}: {
  closePanel: () => void;
  onUploadImage?: (image: Image) => void;
}) => {
  const [keywords, setKeywords] = useState<ImageKeyword[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [uploadImageAndCreateImageDoc, { isLoading: uploadIsLoading }] =
    useUploadImageAndCreateImageDocMutation();

  const addKeyword = (keyword: ImageKeyword) => {
    const newState = [...keywords, keyword];
    setKeywords(newState);
  };

  const removeKeyword = (id: string) => {
    const newState = keywords.filter((k) => k.id !== id);
    setKeywords(newState);
  };

  const handleImageInputFileChange = (e: ChangeEvent<HTMLInputElement>) => {
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

    setImageFile(file);
  };

  const handleSubmit = async () => {
    if (!imageFile) {
      return;
    }

    closePanel();

    const uploadRes = await toast.promise(
      uploadImageAndCreateImageDoc({ file: imageFile, keywords }),
      {
        pending: "Uploading...",
        success: "Uploaded",
        error: "Upload error",
      }
    );

    if ("data" in uploadRes && onUploadImage) {
      const { data } = uploadRes;

      onUploadImage(data);
    }
  };

  const canSubmit = Boolean(imageFile);

  return (
    <div css={[s_popover.panelContainer]}>
      <h2 css={[tw`font-medium text-lg`]}>Upload Image</h2>
      {imageFile ? <ImageFileDisplay file={imageFile} /> : null}
      <div css={[tw`self-start`]}>
        <ChooseImageFileInputButton
          isFile={Boolean(imageFile)}
          onInputFileChange={handleImageInputFileChange}
        />
      </div>
      <UploadImageKeywords
        keywords={keywords}
        addKeyword={addKeyword}
        removeKeyword={removeKeyword}
      />
      <div css={[tw`flex justify-end mt-md`]}>
        <UploadImageSubmitButton
          canSubmit={canSubmit}
          handleSubmit={handleSubmit}
          isLoadingUpload={uploadIsLoading}
        />
      </div>
    </div>
  );
};

const UploadImageSubmitButton = ({
  canSubmit,
  handleSubmit,
  isLoadingUpload,
}: {
  canSubmit: boolean;
  handleSubmit: () => void;
  isLoadingUpload: boolean;
}) => {
  return (
    <button
      css={[
        s_button.panel,
        canSubmit && !isLoadingUpload
          ? tw`border-blue-500 text-blue-500`
          : tw`border-gray-300 text-gray-300 pointer-events-none`,
      ]}
      onClick={handleSubmit}
    >
      {isLoadingUpload ? "..." : "submit"}
    </button>
  );
};

const ChooseImageFileInputButton = ({
  isFile,
  onInputFileChange,
}: {
  isFile: boolean;
  onInputFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <ChooseImageFileInputButtonUI
      buttonText={isFile ? "Change file" : "Choose file"}
      onInputFileChange={onInputFileChange}
    />
  );
};

const uploadInputId = "image-upload-input-id";

const ChooseImageFileInputButtonUI = ({
  buttonText,
  onInputFileChange,
}: {
  buttonText: string;
  onInputFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div>
      <WithTooltip
        text={{
          header: "Upload new",
          body: "Accepted image types: .png, .jpg, .jpeg, .webp",
        }}
        yOffset={13}
      >
        <label
          css={[
            tw`cursor-pointer flex items-center gap-xs text-sm py-1 px-2 border-2 rounded-sm text-gray-500 border-gray-500`,
          ]}
          htmlFor={uploadInputId}
        >
          <span css={[tw`text-gray-400`]}>
            <FileImage weight="bold" />
          </span>
          <span css={[tw`text-sm font-medium`]}>{buttonText}</span>
        </label>
      </WithTooltip>
      <input
        css={[tw`hidden`]}
        accept="image/png, image/jpg, image/jpeg, image/webp"
        onChange={onInputFileChange}
        id={uploadInputId}
        name="files"
        type="file"
        autoComplete="off"
      />
    </div>
  );
};

const ImageFileDisplay = ({ file }: { file: File }) => {
  const imgSrc = URL.createObjectURL(file);

  return (
    <div css={[tw`flex gap-md`]}>
      <div css={[tw`border-2`]}>
        <NextImage
          width={150}
          height={150}
          layout="fixed"
          objectFit="contain"
          src={imgSrc}
          alt=""
          css={[tw`bg-gray-50`]}
        />
      </div>
      <div css={[tw`flex flex-col justify-center`]}>
        <h4 css={[tw`font-medium text-sm`]}>Image file:</h4>
        <p css={[tw`text-sm text-gray-600`]}>{file.name}</p>
      </div>
    </div>
  );
};

const imageUploadKeywordInputId = "image-upload-keyword-input";

const UploadImageKeywords = ({
  keywords,
  addKeyword,
  removeKeyword,
}: {
  keywords: ImageKeyword[];
  addKeyword: (keyword: ImageKeyword) => void;
  removeKeyword: (id: string) => void;
}) => {
  return (
    <UploadImageKeywordsUI
      display={
        <KeywordsDisplayUI keywords={keywords} removeKeyword={removeKeyword} />
      }
      input={
        <KeywordsInput
          inputId={imageUploadKeywordInputId}
          onSubmit={(keyword) => {
            addKeyword(keyword);
          }}
        />
      }
    />
  );
};

const UploadImageKeywordsUI = ({
  display,
  input,
}: {
  display: ReactElement;
  input: ReactElement;
}) => {
  return (
    <div css={[tw`flex flex-col gap-sm`]}>
      {display}
      {input}
    </div>
  );
};
