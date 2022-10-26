import { ReactElement } from "react";
import tw from "twin.macro";

import { GoToPageIcon } from "^components/Icons";
import ContentMenu from "^components/menus/Content";

export const Menu_ = ({
  extraButtons,
  isShowing,
  routeToEditPage,
}: {
  extraButtons?: ReactElement | ReactElement[] | null;
  isShowing: boolean;
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
      </>
    </ContentMenu>
  );
};
