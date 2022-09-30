import { cloneElement, ReactElement } from "react";
import { Article as ArticleIcon, CaretDown, PlusCircle } from "phosphor-react";
import tw from "twin.macro";

function BodyEmpty({ addSectionPopover }: { addSectionPopover: ReactElement }) {
  return (
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
        <p css={[tw`text-gray-600`]}>Get started with the article.</p>
        {cloneElement(
          addSectionPopover,
          addSectionPopover.props,
          <AddSectionButton />
        )}
      </div>
    </div>
  );
}

export default BodyEmpty;

function AddSectionButton() {
  return (
    <button
      css={[tw`inline-flex items-center gap-xxs rounded-md py-1.5 px-3`]}
      className="group"
      type="button"
    >
      <span css={[tw`font-medium capitalize text-gray-600`]}>add section</span>
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
