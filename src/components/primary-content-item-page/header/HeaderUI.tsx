import { ReactElement } from "react";
import tw from "twin.macro";
import HeaderGeneric from "^components/header/HeaderGeneric2";
import SaveButtonUI from "^components/header/SaveButtonUI";
import SaveTextUI from "^components/header/SaveTextUI";
import UndoButtonUI from "^components/header/UndoButtonUI";
import { s_header } from "^styles/header";

function HeaderUI<
  TSaveMutationData extends {
    isError: boolean;
    isLoading: boolean;
    isSuccess: boolean;
  }
>({
  isChange,
  publishPopover,
  saveMutationData,
  translationsPopover,
  collectionsPopover,
  saveFunc,
  subjectsPopover,
  tagsPopover,
  undoFunc,
  settings,
  authorsPopover,
}: {
  isChange: boolean;
  publishPopover: ReactElement;
  saveMutationData: TSaveMutationData;
  translationsPopover: ReactElement;
  subjectsPopover: ReactElement;
  collectionsPopover: ReactElement;
  tagsPopover: ReactElement;
  settings: ReactElement;
  authorsPopover: ReactElement;
  undoFunc: () => void;
  saveFunc: () => void;
}) {
  return (
    <HeaderGeneric
      leftElements={
        <>
          <div css={[tw`flex items-center gap-sm`]}>
            {publishPopover}
            {translationsPopover}
          </div>
          <SaveTextUI isChange={isChange} saveMutationData={saveMutationData} />
        </>
      }
      rightElements={
        <div css={[tw`flex items-center gap-sm`]}>
          {subjectsPopover}
          {collectionsPopover}
          {tagsPopover}
          <div css={[s_header.verticalBar]} />
          {authorsPopover}
          <div css={[s_header.verticalBar]} />
          <UndoButtonUI
            handleUndo={undoFunc}
            isChange={isChange}
            isLoadingSave={saveMutationData.isLoading}
          />
          <SaveButtonUI
            handleSave={saveFunc}
            isChange={isChange}
            isLoadingSave={saveMutationData.isLoading}
          />
          <div css={[s_header.verticalBar]} />
          {settings}
        </div>
      }
      confirmBeforeLeavePage={isChange}
    />
  );
}

export default HeaderUI;
