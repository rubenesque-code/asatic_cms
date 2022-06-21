import { toast } from "react-toastify";
import NextImage from "next/image";
import tw from "twin.macro";
import { Info, Key, Trash } from "phosphor-react";

import { applyFilters, fuzzySearch } from "^helpers/general";

import useHovered from "^hooks/useHovered";

import { useDeleteUploadedImageMutation } from "^redux/services/images";

import { useDispatch, useSelector } from "^redux/hooks";
import {
  addKeyword,
  removeKeyword,
  selectAll,
  selectById,
} from "^redux/state/images";

import { Image } from "^types/image";
import { UsedTypeFilter } from "./Filter";

import WithTooltip from "^components/WithTooltip";
import WithWarning from "^components/WithWarning";
import WithProximityPopover from "^components/WithProximityPopover";
import KeywordsDisplayUI from "^components/keywords/display";
import KeywordsInput from "^components/keywords/input";

import s_button from "^styles/button";
import s_transition from "^styles/transition";
import { s_editorMenu } from "^styles/menus";
import { s_popover } from "^styles/popover";

const UploadedImages = ({
  usedType,
  keywordQuery,
  onImageClick,
}: {
  usedType: UsedTypeFilter;
  keywordQuery: string;
  onImageClick?: ({ id, URL }: { id: string; URL: string }) => void;
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
        <UploadedImage
          image={image}
          onImageClick={() => {
            if (onImageClick) {
              onImageClick({ id: image.id, URL: image.URL });
            }
          }}
          key={image.id}
        />
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

export default UploadedImages;

const UploadedImage = ({
  image,
  onImageClick,
}: {
  image: Image;
  onImageClick?: () => void;
}) => {
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
      <WithTooltip text="Click to add image to the document">
        <span
          css={[tw`cursor-pointer`]}
          onClick={() => {
            if (onImageClick) {
              onImageClick();
            }
          }}
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
