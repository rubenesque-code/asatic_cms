import type { NextPage } from "next";
import { useState } from "react";
import { Upload as UploadIcon } from "phosphor-react";
import tw from "twin.macro";

import PageContent from "^components/pages/catalog/sub-entities/images";

import { Collection } from "^lib/firebase/firestore/collectionKeys";

import Head from "^components/Head";
import QueryDatabase from "^components/QueryDatabase";
import WithUploadImage from "^components/WithUploadImage";
import UploadedImages from "^components/images/Uploaded";
import Filter, { UsedTypeFilter } from "^components/images/Filter";

const ImagesPage: NextPage = () => {
  return (
    <>
      <Head />
      <QueryDatabase
        collections={[
          Collection.IMAGES,
          Collection.ARTICLES,
          Collection.BLOGS,
          Collection.COLLECTIONS,
          Collection.LANDING,
          Collection.RECORDEDEVENTS,
        ]}
      >
        <PageContent />
      </QueryDatabase>
    </>
  );
};

export default ImagesPage;

const Main = () => {
  return (
    <div css={[tw`flex justify-center`]}>
      <main css={[s_top.main, tw`px-xl max-w-[1600px]`]}>
        <h1 css={[s_top.pageTitle]}>Images</h1>
        <Images />
      </main>
    </div>
  );
};

const s_top = {
  main: tw`px-4 mt-2xl flex flex-col gap-lg flex-grow`,
  pageTitle: tw`text-2xl font-medium`,
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
