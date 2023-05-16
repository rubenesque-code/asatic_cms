import { CaretDown, CaretUp } from "phosphor-react";
import { useState } from "react";
import tw from "twin.macro";
import { MissingIcon } from "^components/Icons";

export const $MissingChildDocuments_ = ({
  articles,
  blogs,
  collections = 0,
  recordedEvents = 0,
}: {
  articles: number;
  blogs: number;
  collections?: number;
  recordedEvents?: number;
}) => {
  const [collapse, setCollapse] = useState(false);

  const numDocs = articles + blogs + collections + recordedEvents;

  if (!numDocs) {
    return null;
  }

  return (
    <div css={[tw`p-sm`]}>
      <div css={[tw`flex items-center justify-between`]}>
        <h3 css={[tw`flex items-center gap-xs mb-xs font-medium`]}>
          <span css={[tw`text-red-warning `]}>
            <MissingIcon weight="bold" />
          </span>
          <span
            css={[
              tw`transition-opacity duration-150 ease-in-out`,
              collapse ? tw`opacity-0` : tw`opacity-100`,
            ]}
          >
            The following {numDocs > 1 ? "are" : "is"} connected to this
            document but can&apos;s be found. {numDocs > 1 ? "They" : "It"} may
            have been deleted.
          </span>
        </h3>
        <button
          css={[tw`text-sm text-gray-400`]}
          onClick={() => setCollapse(!collapse)}
          type="button"
        >
          {!collapse ? (
            <div css={[tw`flex items-center gap-xs`]}>
              <p css={[tw`text-gray-400 font-mono uppercase text-xs`]}>Hide</p>
              <CaretUp />
            </div>
          ) : (
            <CaretDown />
          )}
        </button>
      </div>
      <div
        css={[
          tw`transition-max-height duration-300 ease-in-out overflow-hidden`,
          collapse ? tw`max-h-0` : tw`max-h-96`,
        ]}
      >
        {articles ? (
          <p>
            {articles} article{articles > 1 ? "s" : ""}.
          </p>
        ) : null}
        {blogs ? (
          <p>
            {blogs} blog{blogs > 1 ? "s" : ""}.
          </p>
        ) : null}
        {collections ? <p>{collections} collections(s).</p> : null}
        {recordedEvents ? (
          <p>
            {recordedEvents} video document{recordedEvents > 1 ? "s" : ""}.
          </p>
        ) : null}
        <p css={[tw`font-mono text-sm mt-xs`]}>
          Try refreshing the page. If the problem persists, please contact the
          site developer.
        </p>
      </div>
    </div>
  );
};
