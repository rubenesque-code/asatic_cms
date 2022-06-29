import type { NextPage } from "next";
import { useState } from "react";
import { Upload as UploadIcon, CloudArrowUp } from "phosphor-react";
import tw from "twin.macro";

import { useLeavePageConfirm } from "^hooks/useLeavePageConfirm";

import { Collection } from "^lib/firebase/firestore/collectionKeys";

import useImagesPageTopControls from "^hooks/pages/useImagesPageTopControls";

import Head from "^components/Head";
import SideBar from "^components/header/SideBar";
import QueryDatabase from "^components/QueryDatabase";
import WithUploadImage from "^components/WithUploadImage";
import UploadedImages from "^components/images/Uploaded";
import Filter, { UsedTypeFilter } from "^components/images/Filter";
import UndoButtonUI from "^components/header/UndoButtonUI";
import SaveButtonUI from "^components/header/SaveButtonUI";
import SaveTextUI from "^components/header/SaveTextUI";

import { s_header } from "^styles/header";

const ImagesPage: NextPage = () => {
  return (
    <>
      <Head />
      <QueryDatabase collections={[Collection.IMAGES, Collection.ARTICLES]}>
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

const Header = () => {
  const { handleSave, handleUndo, isChange, saveMutationData } =
    useImagesPageTopControls();

  useLeavePageConfirm({ runConfirmOn: isChange });

  return (
    <header css={[s_header.container, tw`border-b`]}>
      <div css={[tw`flex items-center gap-lg`]}>
        <SideBar />
        <div css={[s_header.spacing]}>
          <SaveTextUI isChange={isChange} saveMutationData={saveMutationData} />
        </div>
      </div>
      <div css={[s_header.spacing]}>
        <UndoButtonUI
          handleUndo={handleUndo}
          isChange={isChange}
          isLoadingSave={saveMutationData.isLoading}
          tooltipBodyText="This will affect keywords but won't bring back deleted images nor remove uploaded ones."
        />
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
