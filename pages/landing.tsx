import { NextPage } from "next";
import { ReactElement, useState } from "react";
import {
  Check,
  CloudArrowUp,
  Plus,
  PlusCircle,
  SelectionPlus,
  SquaresFour,
  Translate,
} from "phosphor-react";
import tw from "twin.macro";
import { RadioGroup } from "@headlessui/react";

import { useSelector } from "^redux/hooks";
import {
  selectById,
  selectEntitiesByIds as selectLanguagesByIds,
} from "^redux/state/languages";

import { Collection } from "^lib/firebase/firestore/collectionKeys";

import { siteLanguageIDsArr } from "^constants/data";

import useLandingPageTopControls from "^hooks/pages/useLandingPageTopControls";
import { useLeavePageConfirm } from "^hooks/useLeavePageConfirm";

import {
  ActiveLanguageProvider,
  useActiveLanguageContext,
} from "^context/ActiveLanguageContext";

import { Language } from "^types/language";

import Head from "^components/Head";
import SaveButtonUI from "^components/header/SaveButtonUI";
import SaveTextUI from "^components/header/SaveTextUI";
import SideBar from "^components/header/SideBar";
import UndoButtonUI from "^components/header/UndoButtonUI";
import QueryDatabase from "^components/QueryDatabase";
import WithProximityPopover from "^components/WithProximityPopover";
import WithTooltip from "^components/WithTooltip";

import { s_header } from "^styles/header";
import s_button from "^styles/button";
import { s_popover } from "^styles/popover";
import {
  selectAll as selectAllLandingSections,
  selectTotal as selectTotalLandingSections,
} from "^redux/state/landing";
import AddItemButton from "^components/buttons/AddItem";

const Landing: NextPage = () => {
  return (
    <>
      <Head />
      <QueryDatabase
        collections={[
          Collection.LANDING,
          Collection.ARTICLES,
          Collection.AUTHORS,
          Collection.IMAGES,
          Collection.LANGUAGES,
        ]}
      >
        <PageContent />
      </QueryDatabase>
    </>
  );
};

export default Landing;

const PageContent = () => {
  return (
    <div css={[tw`h-screen max-h-screen overflow-y-hidden flex flex-col`]}>
      <ActiveLanguageProvider>
        <>
          <Header />
          <MainContainer />
        </>
      </ActiveLanguageProvider>
    </div>
  );
};

const Header = () => {
  const { handleSave, handleUndo, isChange, saveMutationData } =
    useLandingPageTopControls();

  useLeavePageConfirm({ runConfirmOn: isChange });

  return (
    <header css={[s_header.container, tw`border-b`]}>
      <div css={[tw`flex items-center gap-md`]}>
        <SideBar />
        <div css={[s_header.spacing]}>
          <LanguageSelect />
          <SaveTextUI isChange={isChange} saveMutationData={saveMutationData} />
        </div>
      </div>
      <div css={[s_header.spacing]}>
        <UndoButtonUI
          handleUndo={handleUndo}
          isChange={isChange}
          isLoadingSave={saveMutationData.isLoading}
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

const LanguageSelect = () => {
  const { activeLanguageId } = useActiveLanguageContext();
  const language = useSelector((state) => selectById(state, activeLanguageId))!;

  return (
    <WithProximityPopover panelContentElement={<LanguageSelectPanel />}>
      <LanguageSelectButtonUI languageName={language.name} />
    </WithProximityPopover>
  );
};

const LanguageSelectButtonUI = ({ languageName }: { languageName: string }) => {
  return (
    <WithTooltip text="site language" placement="right">
      <button css={[tw`flex gap-xxxs items-center`]}>
        <span css={[s_button.subIcon, tw`text-sm -translate-y-1`]}>
          <Translate />
        </span>
        <span css={[tw`text-sm`]}>{languageName}</span>
      </button>
    </WithTooltip>
  );
};

const LanguageSelectPanel = () => {
  const { activeLanguageId, setActiveLanguageId } = useActiveLanguageContext();

  const siteLanguages = useSelector((state) =>
    selectLanguagesByIds(state, siteLanguageIDsArr)
  ) as Language[];
  console.log("siteLanguages:", siteLanguages);

  const value = siteLanguages.find(
    (language) => language.id === activeLanguageId
  ) as Language;
  console.log("value:", value);

  const setValue = (language: Language) => setActiveLanguageId(language.id);

  return (
    <LanguageSelectPanelUI
      languages={
        <LanguageSelectLanguages
          languages={siteLanguages}
          setValue={setValue}
          value={value}
        />
      }
    />
  );
};

const LanguageSelectPanelUI = ({ languages }: { languages: ReactElement }) => {
  return (
    <div css={[s_popover.panelContainer]}>
      <div>
        <h4 css={[tw`font-medium text-lg`]}>Site language</h4>
        <p css={[tw`text-gray-600 mt-xs text-sm`]}>
          Determines the language the site is shown in. For translatable
          documents, e.g. articles, the site will show the relevant translation
          if it exists.
        </p>
      </div>
      <div css={[tw`flex flex-col gap-lg items-start`]}>{languages}</div>
    </div>
  );
};

const LanguageSelectLanguages = ({
  languages,
  setValue,
  value,
}: {
  languages: Language[];
  value: Language;
  setValue: (language: Language) => void;
}) => {
  return (
    <RadioGroup
      as="div"
      css={[tw`flex items-center gap-md`]}
      value={value}
      onChange={setValue}
    >
      <div css={[tw`flex items-center gap-lg`]}>
        {languages.map((language) => (
          <RadioGroup.Option value={language} key={language.id}>
            {({ checked }) => (
              <WithTooltip
                text={checked ? "active language" : "make active"}
                type={checked ? "info" : "action"}
              >
                <div css={[tw`flex items-center gap-xs`]}>
                  {checked ? (
                    <span css={[tw`text-green-active `]}>
                      <Check />
                    </span>
                  ) : null}
                  <span
                    css={[checked ? tw`text-green-active` : tw`cursor-pointer`]}
                  >
                    {language.name}
                  </span>
                </div>
              </WithTooltip>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
};

const MainContainer = () => {
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>();
  const containerHeight = containerRef?.clientHeight;
  // const initialContainerHeight = usePrevious(containerHeight);
  // console.log("initialContainerHeight:", initialContainerHeight);

  return (
    <div
      css={[
        tw`h-full grid place-items-center bg-gray-50 border-t-2 border-gray-200`,
      ]}
    >
      <div css={[tw`w-[800px] max-w-[800px] h-[95%]`]} ref={setContainerRef}>
        {containerHeight ? (
          <div
            css={[tw`overflow-y-auto bg-white shadow-md`]}
            style={{ height: containerHeight }}
          >
            <Main />
          </div>
        ) : null}
      </div>
    </div>
  );
};

const Main = () => {
  const numSections = useSelector(selectTotalLandingSections);

  return (
    <main css={[tw`bg-white p-lg `]}>
      {numSections ? <Sections /> : <Empty />}
    </main>
  );
};

const Empty = () => {
  return (
    <div css={[tw`text-center`]}>
      <div css={[tw` relative text-gray-400 inline-flex items-center`]}>
        <span css={[tw`text-4xl`]}>
          <SquaresFour />
        </span>
        <span css={[tw`absolute bottom-0 right-0 bg-white text-lg`]}>
          <PlusCircle weight="bold" />
        </span>
      </div>
      <div css={[tw``]}>
        <p css={[tw`font-medium`]}>No sections</p>
        <p css={[tw`mt-xs text-gray-600`]}>
          Get started building the landing page
        </p>
      </div>
      <div css={[tw`mt-lg`]}>
        <WithAddSection>
          <AddItemButton>Add section</AddItemButton>
        </WithAddSection>
      </div>
    </div>
  );
};

const WithAddSection = ({ children }: { children: ReactElement }) => {
  return (
    <WithProximityPopover panelContentElement={<AddSectionPanel />}>
      {children}
    </WithProximityPopover>
  );
};

const CustomSectionIcon = ({
  height,
  width,
}: {
  width: number;
  height: number;
}) => {
  return (
    <div style={{ width, height }}>
      <div css={[tw`h-1/2 flex`]}>
        <div css={[tw`w-2/5 border-2 border-blue-400 rounded-sm`]} />
        <div css={[tw`w-3/5 border-2 border-blue-400 rounded-sm`]} />
      </div>
      <div css={[tw`h-1/2 flex`]}>
        <div css={[tw`w-3/5 border-2 border-blue-400 rounded-sm`]} />
        <div css={[tw`w-2/5 border-2 border-blue-400 rounded-sm`]} />
      </div>
      {/*       <div css={[tw`h-1/2`]}>
        <span css={[tw`w-1/2 border`]} />
        <span css={[tw`w-1/2 border`]} />
      </div> */}
    </div>
  );
};

const AddSectionPanel = () => {
  return (
    <div css={[s_popover.panelContainer]}>
      <h3 css={[s_popover.title]}>Add section</h3>
      <div css={[tw`flex flex-col gap-md items-start`]}>
        <div css={[tw`flex items-center gap-sm`]}>
          <button
            css={[
              tw`cursor-pointer flex items-center gap-xs py-1 px-2 border-2 rounded-sm text-blue-500 border-blue-500`,
            ]}
            type="button"
          >
            <span css={[tw`text-xs uppercase font-medium`]}>custom</span>
            <span css={[tw`relative mr-xs`]}>
              <CustomSectionIcon width={16} height={16} />
              <span
                css={[
                  tw`absolute bottom-0 right-0 translate-x-1/2 translate-y-0.5 bg-white text-xs text-blue-400`,
                ]}
              >
                <PlusCircle weight="bold" />
              </span>
            </span>
          </button>
          <p css={[tw`mt-xxs text-left text-gray-600 text-sm`]}>
            Custom sections allow you to add any type of document and edit its
            size.
          </p>
        </div>
        <button>add auto-generated section</button>
      </div>
    </div>
  );
};

const Sections = () => {
  return <div></div>;
};
