import { ReactElement } from "react";
import tw from "twin.macro";

import { GoToPageIcon, RemoveRelatedEntityIcon } from "^components/Icons";
import ContentMenu from "^components/menus/Content";

export const Menu_ = ({
  extraButtons,
  isShowing,
  removeEntityFromCollection,
  routeToEditPage,
}: {
  extraButtons?: ReactElement | ReactElement[] | null;
  isShowing: boolean;
  removeEntityFromCollection: () => void;
  routeToEditPage: () => void;
}) => {
  return (
    <ContentMenu show={isShowing} styles={tw`absolute top-0 right-0`}>
      <>
        {extraButtons ? (
          <>
            {extraButtons}
            <ContentMenu.VerticalBar />
          </>
        ) : null}
        <ContentMenu.Button
          onClick={routeToEditPage}
          tooltipProps={{ text: "go to edit document page" }}
        >
          <GoToPageIcon />
        </ContentMenu.Button>
        <ContentMenu.VerticalBar />
        <ContentMenu.ButtonWithWarning
          tooltipProps={{ text: "remove document from collection" }}
          warningProps={{
            callbackToConfirm: removeEntityFromCollection,
            warningText: "Remove document from collection?",
          }}
        >
          <RemoveRelatedEntityIcon />
        </ContentMenu.ButtonWithWarning>
      </>
    </ContentMenu>
  );
};
