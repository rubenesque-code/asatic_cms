import useLandingPageTopControls from "^hooks/pages/useLandingPageTopControls";
import { useLeavePageConfirm } from "^hooks/useLeavePageConfirm";

import {
  Header_,
  $DefaultButtonSpacing,
  $MutationTextContainer,
  $SaveText_,
  UndoButton_,
  SaveButton_,
} from "^components/header";
import SiteLanguage from "^components/SiteLanguage";
import { AutomaticPopulateIcon } from "^components/Icons";
import { $VerticalBar } from "^components/header";
import $IconButton from "^components/header/_presentation/$IconButton_";
import WithWarning from "^components/WithWarning";
import { usePopulateLandingWithLatest } from "^hooks/landing/usePopulateLandingWithLatest";

const Header = () => {
  const { handleSave, handleUndo, isChange, saveMutationData } =
    useLandingPageTopControls();

  useLeavePageConfirm({ runConfirmOn: isChange });

  return (
    <Header_
      leftElements={
        <>
          <SiteLanguage.Popover />
          <$MutationTextContainer>
            <$SaveText_
              isChange={isChange}
              saveMutationData={saveMutationData}
            />
          </$MutationTextContainer>
        </>
      }
      rightElements={
        <$DefaultButtonSpacing>
          <AutomaticPopulate />
          <$VerticalBar />
          <UndoButton_
            isChange={isChange}
            isLoadingSave={saveMutationData.isLoading}
            undo={handleUndo}
          />
          <SaveButton_
            isChange={isChange}
            isLoadingSave={saveMutationData.isLoading}
            save={handleSave}
          />
        </$DefaultButtonSpacing>
      }
    />
  );
};

export default Header;

const AutomaticPopulate = () => {
  const siteLanguage = SiteLanguage.useContext();

  const populate = usePopulateLandingWithLatest();

  return (
    <WithWarning
      callbackToConfirm={populate}
      warningText={{
        heading: "This will overwrite the existing components",
        body: "You can undo after.",
      }}
      type="moderate"
    >
      <$IconButton
        tooltip={{
          text: `populate page with the latest ${siteLanguage.name} documents.`,
          type: "action",
        }}
      >
        <AutomaticPopulateIcon />
      </$IconButton>
    </WithWarning>
  );
};
