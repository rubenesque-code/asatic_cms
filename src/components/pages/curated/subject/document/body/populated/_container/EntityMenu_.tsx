import { ReactElement } from "react";
import tw from "twin.macro";

import ContentMenu from "^components/menus/Content";
import { GoToPageIcon, RemoveRelatedEntityIcon } from "^components/Icons";

export const EntityMenu_ = ({
  isShowing,
  removeEntity,
  extraButtons,
  routeToEntityPage,
}: {
  isShowing: boolean;
  removeEntity: () => void;
  extraButtons?: ReactElement | ReactElement[] | null;
  routeToEntityPage?: () => void;
}) => {
  return (
    <ContentMenu show={isShowing} styles={tw`absolute top-0 right-0`}>
      {extraButtons ? (
        <>
          {extraButtons}
          <ContentMenu.VerticalBar />
        </>
      ) : null}
      {routeToEntityPage ? (
        <>
          <ContentMenu.Button
            onClick={routeToEntityPage}
            tooltipProps={{ text: "go to edit document page" }}
          >
            <GoToPageIcon />
          </ContentMenu.Button>
          <ContentMenu.VerticalBar />
        </>
      ) : null}
      <ContentMenu.ButtonWithWarning
        tooltipProps={{ text: "remove document from subject" }}
        warningProps={{
          callbackToConfirm: removeEntity,
          warningText: "Remove document from subject?",
        }}
      >
        <RemoveRelatedEntityIcon />
      </ContentMenu.ButtonWithWarning>
    </ContentMenu>
  );
};
