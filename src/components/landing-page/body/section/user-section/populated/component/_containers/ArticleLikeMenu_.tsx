import { TurnOnIcon } from "^components/Icons";
import ContentMenu from "^components/menus/Content";
import Menu_ from "./Menu_";

const ArticleLikeMenu_ = ({
  isShowing,
  toggleUseImageOn,
  usingImage,
}: {
  isShowing: boolean;
  usingImage: boolean;
  toggleUseImageOn: () => void;
}) => {
  return (
    <Menu_ isShowing={isShowing}>
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
