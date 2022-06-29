import { NextPage } from "next";
import { CloudArrowUp } from "phosphor-react";
import { ComponentProps, ReactElement } from "react";
import tw from "twin.macro";
import Head from "^components/Head";
import SaveButtonUI from "^components/header/SaveButtonUI";
import SaveTextUI from "^components/header/SaveTextUI";
import SideBar from "^components/header/SideBar";
import UndoButtonUI from "^components/header/UndoButtonUI";
import QueryDatabase from "^components/QueryDatabase";
import useLandingPageTopControls from "^hooks/pages/useLandingPageTopControls";
import { useLeavePageConfirm } from "^hooks/useLeavePageConfirm";
import { Collection } from "^lib/firebase/firestore/collectionKeys";
import { s_header } from "^styles/header";

type Props = {
  children: ReactElement;
  collections: ComponentProps<typeof QueryDatabase>["collections"];
};

const ContentPageSkeleton = ({ children, collections }: Props) => {
  return (
    <>
      <Head />
      <QueryDatabase collections={collections}>
        <PageContent header={<Header />}>{children}</PageContent>
      </QueryDatabase>
    </>
  );
};

export default ContentPageSkeleton;

const PageContent = ({
  children,
  header,
}: {
  children: ReactElement;
  header: ReactElement;
}) => {
  return (
    <div css={[tw`min-h-screen flex-col gap-lg`]}>
      {header}
      {children}
    </div>
  );
};

const Header = () => {
  const { handleSave, handleUndo, isChange, saveMutationData } =
    useLandingPageTopControls();

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
