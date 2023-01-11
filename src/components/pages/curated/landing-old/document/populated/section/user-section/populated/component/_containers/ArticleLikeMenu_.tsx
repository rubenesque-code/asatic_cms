import { TurnOnIcon } from "^components/Icons";
import ContentMenu from "^components/menus/Content";
import Menu_ from "./Menu_";

const ArticleLikeMenu_ = ({
  isShowing,
  routeToEntityPage,
  toggleUseImageOn,
  usingImage,
}: {
  isShowing: boolean;
  routeToEntityPage: () => void;
  toggleUseImageOn: () => void;
  usingImage: boolean;
}) => {
  return (
    <Menu_ isShowing={isShowing} routeToEntityPage={routeToEntityPage}>
      {!usingImage ? (
        <>
          <ContentMenu.VerticalBar />
          <ContentMenu.Button
            onClick={toggleUseImageOn}
            tooltipProps={{ text: "use image" }}
          >
            <TurnOnIcon />
          </ContentMenu.Button>
        </>
      ) : null}
    </Menu_>
  );
};

export default ArticleLikeMenu_;
