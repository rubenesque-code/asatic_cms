import { CaretDown, PlusCircle } from "phosphor-react";
import { ReactElement } from "react";
import tw from "twin.macro";
import { ArticleIcon } from "^components/Icons";

const $Empty = ({
  addPrimaryEntityPopover,
}: {
  addPrimaryEntityPopover: (button: ReactElement) => ReactElement;
}) => {
  return (
    <div css={[tw`min-h-[300px] pl-lg pt-lg`]}>
      <div css={[tw`mt-md font-sans`]}>
        <div css={[tw` relative text-gray-300 inline-flex items-center`]}>
          <span css={[tw`text-3xl`]}>
            <ArticleIcon weight="thin" />
          </span>
          <span css={[tw`absolute bottom-0 -right-1 bg-white`]}>
            <PlusCircle />
          </span>
        </div>
        <div css={[tw`flex items-center gap-xxs mt-xs`]}>
          <p css={[tw`text-gray-600`]}>Get started with the collection</p>
          {addPrimaryEntityPopover(<Button />)}
        </div>
      </div>
    </div>
  );
};

export default $Empty;

function Button() {
  return (
    <button
      css={[tw`inline-flex items-center gap-xxs rounded-md py-1.5 px-3`]}
      className="group"
      type="button"
    >
      <span css={[tw`font-medium capitalize text-gray-600`]}>Add document</span>
      <span
        css={[
          tw`p-xxxs group-hover:bg-gray-50 group-active:bg-gray-100 rounded-full transition-colors duration-75 ease-in-out text-gray-500 text-xs`,
        ]}
      >
        <CaretDown />
      </span>
    </button>
  );
}
