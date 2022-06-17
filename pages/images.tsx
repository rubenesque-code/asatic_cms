import type { NextPage } from "next";
import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  ReactElement,
  SetStateAction,
  useState,
} from "react";
import NextImage from "next/image";
import {
  Upload as UploadIcon,
  CloudArrowUp,
  Funnel,
  Info,
  Trash,
  Plus,
  FileImage,
} from "phosphor-react";
import tw from "twin.macro";
import { RadioGroup } from "@headlessui/react";
import { toast } from "react-toastify";
import { v4 as generateUId } from "uuid";

import useHovered from "^hooks/useHovered";

import { Collection } from "^lib/firebase/firestore/collectionKeys";

import {
  useDeleteUploadedImageMutation,
  useUploadImageAndCreateImageDocMutation,
} from "^redux/services/images";

import { useSelector, useDispatch } from "^redux/hooks";
import { selectAll, removeKeyword, addKeyword } from "^redux/state/images";

import { Image as ImageType, ImageKeyword } from "^types/image";

import Head from "^components/Head";
import SideBar from "^components/header/SideBar";
import QueryDatabase from "^components/QueryDatabase";
import WithTooltip from "^components/WithTooltip";
import WithWarning from "^components/WithWarning";

import { s_header } from "^styles/header";
import s_button from "^styles/button";
import { s_editorMenu } from "^styles/menus";
import WithProximityPopover from "^components/WithProximityPopover";
import { s_popover } from "^styles/popover";

// todo: delete image removes from storage as well as firestore

// todo| COME BACK TO
// todo: imageskeywords. need a imageskeywords page as well?!update [id]/articles with imagekeywords type for initial fetch and page save
// display as grid
// any order
// search bar searching key words
// key words as buttons
// used/unused buttons (as well as an icon something between an info and warning icon on each image)

const ImagesPage: NextPage = () => {
  return (
    <div>
      <Head />
      <QueryDatabase collections={[Collection.IMAGES]}>
        <PageContent />
      </QueryDatabase>
    </div>
  );
};

export default ImagesPage;

const PageContent = () => {
  return (
    <div css={[tw`min-h-screen flex-col gap-lg`]}>
      <Header />
      <Main />
    </div>
  );
};

const s_top = {
  main: tw`px-4 mt-2xl flex flex-col gap-lg flex-grow`,
  indentedContainer: tw`ml-xl grid gap-lg`,
  pageTitle: tw`text-2xl font-medium`,
};

const Header = () => {
  return (
    <header css={[s_header.container, tw`border-b`]}>
      <SideBar />
      <div css={[s_header.spacing]}>
        <div css={[s_header.verticalBar]} />
        <button css={[s_header.button]}>
          <CloudArrowUp />
        </button>
      </div>
    </header>
  );
};

const Main = () => {
  return (
    <main css={[s_top.main, tw`px-xl`]}>
      <h1 css={[s_top.pageTitle]}>Images</h1>
      <Images />
    </main>
  );
};

const Images = () => {
  const [usedType, setUsedType] = useState<UsedTypeFilter>("all");
  const [keywordInputValue, setKeywordInputValue] = useState("");

  return (
    <div css={[tw`mt-md flex flex-col gap-sm`]}>
      <Filter
        keywordInputValue={keywordInputValue}
        setKeywordInputValue={setKeywordInputValue}
        setUsedType={setUsedType}
        usedType={usedType}
      />
      <div css={[tw`flex flex-col gap-xs`]}>
        <div css={[tw`self-end`]}>
          <WithUploadImage>
            <button
              css={[
                tw`cursor-pointer flex items-center gap-sm py-1 px-2 border-2 rounded-sm text-blue-500 border-blue-500`,
              ]}
            >
              <span css={[tw`text-xs uppercase font-medium`]}>Upload new</span>
              <span css={[tw`text-blue-400`]}>
                <UploadIcon weight="bold" />
              </span>
            </button>
          </WithUploadImage>
        </div>
        <UploadedImages usedType={usedType} />
      </div>
    </div>
  );
};

type UsedTypeFilter = "used" | "unused" | "all";

const Filter = ({
  keywordInputValue,
  setKeywordInputValue,
  setUsedType,
  usedType,
}: {
  keywordInputValue: string;
  setKeywordInputValue: Dispatch<SetStateAction<string>>;
  setUsedType: Dispatch<SetStateAction<UsedTypeFilter>>;
  usedType: UsedTypeFilter;
}) => {
  return (
    <div css={[tw`flex flex-col gap-sm`]}>
      <h3 css={[tw`font-medium text-xl flex items-center gap-xs`]}>
        <span>
          <Funnel />
        </span>
        <span>Filters</span>
      </h3>
      <div css={[tw`flex flex-col gap-xs`]}>
        <KeywordSearch
          setValue={setKeywordInputValue}
          value={keywordInputValue}
        />
        <div>
          <UsedTypeSelect value={usedType} setValue={setUsedType} />
        </div>
      </div>
    </div>
  );
};

const keywordFilterInputId = "images-keyword-filter-input-id";

const KeywordSearch = ({
  setValue,
  value,
}: {
  setValue: Dispatch<SetStateAction<string>>;
  value: string;
}) => {
  return (
    <div css={[tw`relative flex items-center gap-xs`]}>
      <label htmlFor={keywordFilterInputId}>Keyword:</label>
      <input
        css={[
          tw`text-gray-600 focus:text-gray-800 px-xs py-1 outline-none border-2 border-transparent focus:border-gray-200 rounded-sm`,
        ]}
        id={keywordFilterInputId}
        value={value}
        onChange={(e) => {
          const value = e.target.value;
          setValue(value);
        }}
        placeholder="keyword..."
        type="text"
      />
    </div>
  );
};

const typeSelectOptionsData: { value: UsedTypeFilter }[] = [
  { value: "all" },
  { value: "used" },
  { value: "unused" },
];

const UsedTypeSelect = ({
  setValue,
  value,
}: {
  setValue: Dispatch<SetStateAction<UsedTypeFilter>>;
  value: UsedTypeFilter;
}) => {
  return (
    <RadioGroup
      as="div"
      css={[tw`flex items-center gap-md`]}
      value={value}
      onChange={setValue}
    >
      <RadioGroup.Label css={[tw``]}>Type:</RadioGroup.Label>
      <div css={[tw`flex items-center gap-sm`]}>
        {typeSelectOptionsData.map((option) => (
          <RadioGroup.Option value={option.value} key={option.value}>
            {({ checked }) => (
              <span
                css={[
                  checked
                    ? tw`underline text-green-active`
                    : tw`cursor-pointer`,
                ]}
              >
                {option.value}
              </span>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
};

const WithUploadImage = ({ children }: { children: ReactElement }) => {
  return (
    <WithProximityPopover panelContentElement={<UploadImagePanel />}>
      {children}
    </WithProximityPopover>
  );
};

const UploadImagePanel = () => {
  const [keywords, setKeywords] = useState<ImageKeyword[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);

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

  const handleSubmit = () => {
    if (!imageFile) {
      return;
    }
  };

  return (
    <div css={[s_popover.panelContainer]}>
      <h2 css={[tw`font-medium text-lg`]}>Image</h2>
      {imageFile ? <ImageFileDisplay file={imageFile} /> : null}
      <div css={[tw`self-start`]}>
        <UploadImageButton
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
        <button
          css={[
            s_button.panel,
            imageFile
              ? tw`border-blue-500 text-blue-500`
              : tw`border-gray-300 text-gray-300`,
          ]}
        >
          submit
        </button>
      </div>
    </div>
  );
};

const UploadImageButton = ({
  isFile,
  onInputFileChange,
}: {
  isFile: boolean;
  onInputFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <UploadImageButtonUI
      buttonText={isFile ? "Change file" : "Choose file"}
      onInputFileChange={onInputFileChange}
    />
  );
};

const uploadInputId = "image-upload-input-id";

const UploadImageButtonUI = ({
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
        <h4 css={[tw`font-medium text-sm`]}>Image name:</h4>
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

const KeywordsDisplayUI = ({
  keywords,
  removeKeyword,
}: {
  keywords: ImageKeyword[];
  removeKeyword: (id: string) => void;
}) => {
  return (
    <div css={[tw`flex flex-col gap-sm`]}>
      <div>
        <h3 css={[tw`font-medium`]}>Keywords</h3>
        <p css={[tw`text-gray-600 mt-xs text-sm`]}>
          {!keywords.length ? "None yet. " : null}
          Keywords can be used to search for images in the future.
        </p>
      </div>
      <div css={[tw`flex items-center gap-xs`]}>
        {keywords.length
          ? keywords.map((keyword) => (
              <div
                className="group"
                css={[tw`relative border rounded-md py-0.5 px-1`]}
                key={keyword.id}
              >
                <p css={[tw`text-sm text-gray-600 group-hover:text-gray-800`]}>
                  {keyword.text}
                </p>
                <WithWarning
                  warningText={{ heading: "Delete keyword?" }}
                  callbackToConfirm={() => removeKeyword(keyword.id)}
                  type="moderate"
                >
                  <WithTooltip text="delete keyword">
                    <span
                      css={[
                        tw`z-10 absolute top-0 right-0 -translate-y-1 translate-x-1`,
                        tw`opacity-0 group-hover:opacity-100 hover:text-red-warning hover:scale-110 cursor-pointer text-xs transition-all duration-75 ease-in-out`,
                      ]}
                    >
                      <Trash />
                    </span>
                  </WithTooltip>
                </WithWarning>
              </div>
            ))
          : null}
      </div>
    </div>
  );
};

const KeywordsInput = ({
  inputId,
  onSubmit,
}: {
  inputId: string;
  onSubmit: (keyword: ImageKeyword) => void;
}) => {
  const [value, setValue] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const valueIsValid = value.length > 2;

    if (!valueIsValid) {
      return;
    }

    onSubmit({ id: generateUId(), text: value });
    setValue("");
    // dispatch(addKeyword({ id: imageId, keywordText: value }));
  };

  return (
    <KeywordsInputUI
      inputId={inputId}
      onSubmit={handleSubmit}
      setValue={setValue}
      value={value}
    />
  );
};

const KeywordsInputUI = ({
  inputId,
  onSubmit,
  setValue,
  value,
}: {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  inputId: string;
  value: string;
  setValue: (text: string) => void;
}) => {
  return (
    <form css={[tw`relative`]} onSubmit={onSubmit}>
      <label
        css={[tw`absolute left-2 top-1/2 -translate-y-1/2 text-gray-500`]}
        htmlFor={inputId}
      >
        <Plus />
      </label>
      <input
        css={[
          tw`text-gray-600 focus:text-gray-800 text-sm px-lg py-1 outline-none border-2 border-transparent focus:border-gray-200 rounded-sm`,
        ]}
        id={inputId}
        value={value}
        onChange={(e) => {
          const value = e.target.value;
          setValue(value);
        }}
        placeholder="Add a new keyword..."
        autoComplete="off"
        type="text"
      />
    </form>
  );
};

const UploadedImages = ({ usedType }: { usedType: UsedTypeFilter }) => {
  const images = useSelector(selectAll);

  const imagesFilteredByUsedType =
    usedType === "all"
      ? images
      : images.filter((image) =>
          usedType === "used"
            ? image.relatedArticleIds?.length
            : !image.relatedArticleIds?.length
        );

  return imagesFilteredByUsedType.length ? (
    <div css={[tw`grid grid-cols-4 gap-sm`]}>
      {imagesFilteredByUsedType.map((image) => (
        <UploadedImage image={image} key={image.id} />
      ))}
    </div>
  ) : (
    <p>{usedType === "all" ? "No images yet" : "No images for filter"}</p>
  );
};

const UploadedImage = ({ image }: { image: ImageType }) => {
  // * was a bug using tailwind's group hover functionality so using the below
  const [containerIsHovered, containerHoverHandlers] = useHovered();

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
        tw`transition-transform ease-in-out duration-75`,
      ]}
      {...containerHoverHandlers}
      key={image.id}
    >
      <NextImage
        src={image.URL}
        placeholder="blur"
        blurDataURL={image.blurURL}
        layout="fill"
        objectFit="contain"
      />
      {!imageIsUsed ? (
        <WithTooltip
          text="this image is unused in any document and can safely be deleted."
          yOffset={10}
        >
          <span
            css={[tw`absolute text-lg text-gray-400 rounded-full bg-white `]}
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
                tw`hover:text-red-warning hover:scale-125`,
                tw`absolute right-0 translate-x-1/4 -translate-y-0 shadow-lg text-base`,
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
