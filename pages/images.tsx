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
  Key,
  FloppyDisk,
  WarningCircle,
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
import {
  selectAll,
  removeKeyword,
  addKeyword,
  selectById,
} from "^redux/state/images";

import { Image, Image as ImageType, ImageKeyword } from "^types/image";

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
import { applyFilters, fuzzySearch } from "^helpers/general";
import s_transition from "^styles/transition";
import useImagesPageTopControls from "^hooks/pages/useImagesPageTopControls";

// tdoo: go over article page save to make sure images is working right
// todo: max width container
// todo: change withaddimage

// todo| COME BACK TO
// display as grid
// any order
// search bar searching key words
// key words as buttons
// used/unused buttons (as well as an icon something between an info and warning icon on each image)

const ImagesPage: NextPage = () => {
  return (
    <>
      <Head />
      <QueryDatabase collections={[Collection.IMAGES]}>
        <PageContent />
      </QueryDatabase>
    </>
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
  const { handleSave, isChange, saveMutationData } = useImagesPageTopControls();

  return (
    <header css={[s_header.container, tw`border-b`]}>
      <div css={[tw`flex items-center gap-lg`]}>
        <SideBar />
        <div css={[s_header.spacing]}>
          <p css={[tw`text-sm text-gray-600`]}>
            {saveMutationData.isLoading ? (
              "saving..."
            ) : saveMutationData.isSuccess && !isChange ? (
              "saved"
            ) : saveMutationData.isError ? (
              <WithTooltip
                text={{
                  header: "Save error",
                  body: "Try saving again. If the problem persists, please contact the site developer.",
                }}
              >
                <span css={[tw`text-red-warning flex gap-xxs items-center`]}>
                  <WarningCircle />
                  <span>save error</span>
                </span>
              </WithTooltip>
            ) : null}
          </p>
        </div>
      </div>
      <div css={[s_header.spacing]}>
        <SaveButtonUI
          handleSave={handleSave}
          isChange={isChange}
          isLoadingSave={saveMutationData.isLoading}
        />
        <div css={[s_header.verticalBar]} />
        <button css={[s_header.button]}>
          <CloudArrowUp />
        </button>
      </div>
    </header>
  );
};

const SaveButtonUI = ({
  handleSave,
  isChange,
  isLoadingSave,
}: {
  isLoadingSave: boolean;
  isChange: boolean;
  handleSave: () => void;
}) => {
  return (
    <WithTooltip
      text={isLoadingSave ? "saving..." : isChange ? "save" : "nothing to save"}
      type="action"
    >
      <button
        css={[
          s_header.button,
          (!isChange || isLoadingSave) && tw`text-gray-500 cursor-auto`,
        ]}
        onClick={handleSave}
        type="button"
      >
        <FloppyDisk />
      </button>
    </WithTooltip>
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
    <div css={[tw`mt-md`]}>
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
                tw`-translate-y-xs cursor-pointer flex items-center gap-sm py-1 px-2 border-2 rounded-sm text-blue-500 border-blue-500`,
              ]}
            >
              <span css={[tw`text-xs uppercase font-medium`]}>Upload new</span>
              <span css={[tw`text-blue-400`]}>
                <UploadIcon weight="bold" />
              </span>
            </button>
          </WithUploadImage>
        </div>
        <UploadedImages usedType={usedType} keywordQuery={keywordInputValue} />
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
        autoComplete="off"
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
    <WithProximityPopover
      panelContentElement={({ close }) => (
        <UploadImagePanel closePanel={close} />
      )}
    >
      {children}
    </WithProximityPopover>
  );
};

const UploadImagePanel = ({ closePanel }: { closePanel: () => void }) => {
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

    await toast.promise(
      uploadImageAndCreateImageDoc({ file: imageFile, keywords }),
      {
        pending: "Uploading...",
        success: "Uploaded",
        error: "Upload error",
      }
    );
  };

  const canSubmit = Boolean(imageFile);

  return (
    <div css={[s_popover.panelContainer]}>
      <h2 css={[tw`font-medium text-lg`]}>Image</h2>
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
              <Keyword
                keyword={keyword}
                removeKeyword={() => removeKeyword(keyword.id)}
                key={keyword.id}
              />
            ))
          : null}
      </div>
    </div>
  );
};

const Keyword = ({
  keyword,
  removeKeyword,
}: {
  keyword: ImageKeyword;
  removeKeyword: () => void;
}) => {
  const [containerIsHovered, hoverHandlers] = useHovered();
  return (
    <div
      // className="group"
      css={[tw`relative border rounded-md py-0.5 px-1`]}
      {...hoverHandlers}
      key={keyword.id}
    >
      <p css={[tw`text-sm text-gray-600 group-hover:text-gray-800`]}>
        {keyword.text}
      </p>
      <WithWarning
        warningText={{ heading: "Delete keyword from image?" }}
        callbackToConfirm={removeKeyword}
        type="moderate"
      >
        <WithTooltip text="delete keyword from image">
          <span
            css={[
              tw`z-10 absolute top-0 right-0 -translate-y-1 translate-x-1`,
              tw`hover:text-red-warning hover:scale-110 cursor-pointer text-xs transition-all duration-75 ease-in-out`,
              s_transition.toggleVisiblity(containerIsHovered),
            ]}
          >
            <Trash />
          </span>
        </WithTooltip>
      </WithWarning>
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
          const valueFormatted = value.toLowerCase();
          setValue(valueFormatted);
        }}
        placeholder="Add a new keyword..."
        autoComplete="off"
        type="text"
      />
    </form>
  );
};

const UploadedImages = ({
  usedType,
  keywordQuery,
}: {
  usedType: UsedTypeFilter;
  keywordQuery: string;
}) => {
  const images = useSelector(selectAll);

  const validQuery = keywordQuery.length > 1;

  const filterImagesByUsedType = (images: Image[], usedType: UsedTypeFilter) =>
    usedType === "all"
      ? images
      : images.filter((image) => {
          const isUsed = image.relatedArticleIds?.length;
          return usedType === "used" ? isUsed : !isUsed;
        });

  const filterImagesByQuery = (images: Image[]) => {
    if (!validQuery) {
      return images;
    }
    const result = fuzzySearch(["keywords.text"], images, keywordQuery).map(
      (f) => f.item
    );
    return result;
  };

  const filteredImages = applyFilters({
    initialArr: images,
    filters: [
      (images) => filterImagesByUsedType(images, usedType),
      filterImagesByQuery,
    ],
  });

  return filteredImages.length ? (
    <div css={[tw`grid grid-cols-4 gap-sm`]}>
      {filteredImages.map((image) => (
        <UploadedImage image={image} key={image.id} />
      ))}
    </div>
  ) : (
    <p css={[tw`text-gray-800`]}>
      {usedType === "all" && !validQuery
        ? "No images yet"
        : "No images for filter(s)"}
    </p>
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
      className="group"
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
      <UploadedImageMenu imageId={image.id} />
      {!imageIsUsed ? (
        <WithWarning
          warningText={{
            heading: "Delete image?",
            body: "This can't be undone.",
          }}
          callbackToConfirm={handleDeleteImage}
          type="moderate"
        >
          <WithTooltip text="delete image">
            <button
              css={[
                s_button.icon,
                tw`hover:text-red-warning hover:scale-125`,
                tw`absolute right-0 translate-x-1/4 bottom-0 translate-y-1/3 shadow-lg text-base`,
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

const UploadedImageMenu = ({ imageId }: { imageId: string }) => {
  return (
    <menu
      css={[
        s_transition.onGroupHover,
        tw`z-20 absolute right-0 top-0`,
        tw`bg-white py-xxs px-xs rounded-md shadow-md border`,
      ]}
    >
      <KeywordPopover imageId={imageId} />
    </menu>
  );
};

const KeywordPopover = ({ imageId }: { imageId: string }) => {
  return (
    <WithProximityPopover
      panelContentElement={<KeywordPopoverPanel imageId={imageId} />}
    >
      <KeywordPopoverButton />
    </WithProximityPopover>
  );
};

const KeywordPopoverButton = () => {
  return (
    <WithTooltip text="edit keywords">
      <button css={[s_editorMenu.button.button]} type="button">
        <Key />
      </button>
    </WithTooltip>
  );
};

const KeywordPopoverPanel = ({ imageId }: { imageId: string }) => {
  const image = useSelector((state) => selectById(state, imageId))!;
  const { keywords } = image;

  const dispatch = useDispatch();

  return (
    <div css={[s_popover.panelContainer]}>
      <div css={[tw`flex flex-col gap-sm`]}>
        <KeywordsDisplayUI
          keywords={keywords}
          removeKeyword={(keywordId) =>
            dispatch(removeKeyword({ id: imageId, keywordId }))
          }
        />
        <KeywordsInput
          inputId={`keyword-input-image-${imageId}`}
          onSubmit={({ text }) => dispatch(addKeyword({ id: imageId, text }))}
        />
      </div>
    </div>
  );
};