import { Trash } from "phosphor-react";
import tw from "twin.macro";
import WithTooltip from "^components/WithTooltip";
import WithWarning from "^components/WithWarning";
import useHovered from "^hooks/useHovered";
import s_transition from "^styles/transition";
import { ImageKeyword } from "^types/image";

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

export default KeywordsDisplayUI;

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
