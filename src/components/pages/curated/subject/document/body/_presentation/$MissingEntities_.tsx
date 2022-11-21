import { CaretDown, CaretUp } from "phosphor-react";
import { useState } from "react";
import tw from "twin.macro";
import { MissingIcon } from "^components/Icons";

export const $MissingEntities_ = ({
  articles,
  blogs,
  collections,
  recordedEvents,
}: {
  articles: number;
  blogs: number;
  collections: number;
  recordedEvents: number;
}) => {
  const [collapse, setCollapse] = useState(false);

  if (!articles && !blogs && !collections && !recordedEvents) {
    return null;
  }

  return (
    <div css={[tw`p-sm`]}>
      <div css={[tw`flex items-center justify-between`]}>
        <h3 css={[tw`flex items-center gap-xs mb-xs font-medium`]}>
          <span css={[tw`text-red-warning `]}>
            <MissingIcon weight="bold" />
          </span>
          {collapse ? "" : "This subject has missing entity(s):"}
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
            {blogs} blogs{blogs > 1 ? "s" : ""}.
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
