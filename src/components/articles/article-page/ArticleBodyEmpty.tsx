import { ArrowRight, Article as ArticleIcon } from "phosphor-react";
import tw from "twin.macro";
import WithAddSection from "./WithAddSection";

const ArticleBodyEmpty = () => {
  return (
    <div css={[tw`text-center py-lg font-sans`]}>
      <div css={[tw`inline-block`]}>
        <p css={[tw`font-medium flex items-center gap-sm`]}>
          <span>
            <ArticleIcon />
          </span>
          <span>Article body</span>
        </p>
        <p css={[tw`mt-xxs text-gray-600 text-sm`]}>No content yet</p>
      </div>
      <div css={[tw`mt-md`]}>
        <WithAddSection sectionToAddIndex={0}>
          <button
            css={[
              tw`flex items-center gap-xs text-sm text-gray-700 font-medium border border-gray-400 py-0.5 px-3 rounded-sm`,
            ]}
            type="button"
          >
            <span>Add Content</span>
            <span>
              <ArrowRight />
            </span>
          </button>
        </WithAddSection>
      </div>
    </div>
  );
};

export default ArticleBodyEmpty;
