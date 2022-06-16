import type { NextPage } from "next";
import { CloudArrowUp, FilePlus, Funnel } from "phosphor-react";
import tw from "twin.macro";

import { Collection } from "^lib/firebase/firestore/collectionKeys";

import Head from "^components/Head";
import SideBar from "^components/header/SideBar";
import QueryDatabase from "^components/QueryDatabase";

import { s_header } from "^styles/header";
import { Dispatch, SetStateAction, useState } from "react";
import { RadioGroup } from "@headlessui/react";

// todo: delete image removes from storage as well as firestore

// todo| COME BACK TO
// todo: imageskeywords. need a imageskeywords page as well?!update [id]/articles with imagekeywords type for initial fetch and page save
// display as grid
// any order
// search bar searching key words
// key words as buttons
// used/unused buttons (as well as an icon something between an info and warning icon on each image)

const ImagesPage: NextPage = () => {
  return (
    <div>
      <Head />
      <QueryDatabase collections={[Collection.IMAGES]}>
        <PageContent />
      </QueryDatabase>
    </div>
  );
};

export default ImagesPage;

const PageContent = () => {
  return (
    <div css={[tw`min-h-screen flex-col gap-md`]}>
      <Header />
      <main css={[s_top.main]}>
        <div css={[s_top.indentedContainer]}>
          <h1 css={[s_top.pageTitle]}>Images</h1>
          <div>
            <UploadImage />
          </div>
        </div>
        <Images />
      </main>
    </div>
  );
};

const s_top = {
  main: tw`px-4 mt-2xl flex flex-col gap-lg flex-grow`,
  indentedContainer: tw`ml-xl grid gap-lg`,
  pageTitle: tw`text-2xl font-medium`,
};

const Header = () => {
  return (
    <header css={[s_header.container, tw`border-b`]}>
      <SideBar />
      <div css={[s_header.spacing]}>
        <div css={[s_header.verticalBar]} />
        <button css={[s_header.button]}>
          <CloudArrowUp />
        </button>
      </div>
    </header>
  );
};

const UploadImage = () => {
  // const dispatch = useDispatch();
  return (
    <button
      onClick={() => null}
      tw="flex items-center gap-8 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 duration-75 active:translate-y-0.5 active:translate-x-0.5 transition-all ease-in-out text-white rounded-md py-2 px-4"
      type="button"
    >
      <span tw="font-medium uppercase text-sm">Upload image</span>
      <span>
        <FilePlus />
      </span>
    </button>
  );
};

const Images = () => {
  return (
    <div>
      <Filter />
      <UploadedImages />
    </div>
  );
};

type UsedTypeFilter = "used" | "unused" | "all";

const Filter = () => {
  const [usedType, setUsedType] = useState<UsedTypeFilter>("all");

  return (
    <div css={[tw`flex flex-col gap-sm ml-xl`]}>
      <h3 css={[tw`font-medium text-xl flex items-center gap-xs`]}>
        <span>
          <Funnel />
        </span>
        <span>Filters</span>
      </h3>
      <div css={[tw`flex flex-col gap-xs`]}>
        <div>
          <h4>Keyword:</h4>
          <KeywordSearch />
        </div>
        <div>
          <UsedTypeSelect value={usedType} setValue={setUsedType} />
        </div>
      </div>
    </div>
  );
};

const KeywordSearch = () => {
  return <div></div>;
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
                  checked ? tw`underline text-blue-600` : tw`cursor-pointer`,
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

const UploadedImages = () => {
  return <div></div>;
};
