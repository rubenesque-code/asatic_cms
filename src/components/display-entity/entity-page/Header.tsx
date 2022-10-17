import { ReactElement } from "react";

import Header_ from "^components/header/_containers/Header_";
import {
  $DefaultButtonSpacing,
  $MutationTextContainer,
  $VerticalBar,
} from "^components/header/_styles";

const DisplayEntityHeader = ({
  entityLanguagesPopover,
  publishPopover,
  saveButton,
  saveText,
  settingsPopover,
  subjectsPopover,
  undoButton,
  authorsPopover,
  collectionsPopover,
  tagsPopover,
  extraRightElements,
}: {
  publishPopover: ReactElement;
  entityLanguagesPopover: ReactElement;
  saveText: ReactElement;
  subjectsPopover: ReactElement;
  collectionsPopover?: ReactElement;
  authorsPopover?: ReactElement;
  tagsPopover?: ReactElement;
  undoButton: ReactElement;
  saveButton: ReactElement;
  settingsPopover: ReactElement;
  extraRightElements?: ReactElement;
}) => {
  return (
    <Header_
      leftElements={
        <>
          <$DefaultButtonSpacing>
            {publishPopover}
            {entityLanguagesPopover}
          </$DefaultButtonSpacing>
          <$MutationTextContainer>{saveText}</$MutationTextContainer>
        </>
      }
      rightElements={
        <$DefaultButtonSpacing>
          {extraRightElements ? (
            <>
              {extraRightElements}
              <$VerticalBar />
            </>
          ) : null}
          {subjectsPopover}
          {collectionsPopover ? <>{collectionsPopover}</> : null}
          {tagsPopover}
          <$VerticalBar />
          {authorsPopover ? (
            <>
              {authorsPopover}
              <$VerticalBar />
            </>
          ) : null}
          {undoButton}
          {saveButton}
          <$VerticalBar />
          {settingsPopover}
        </$DefaultButtonSpacing>
      }
    />
  );
};

export default DisplayEntityHeader;
