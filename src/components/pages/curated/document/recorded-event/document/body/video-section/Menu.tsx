import tw from "twin.macro";
import ContentMenu from "^components/menus/Content";
import { UpdateVideoSrcButton_ } from "^components/pages/curated/document/_containers/VideoMenu_";
import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";

const Menu = ({ isShowing }: { isShowing: boolean }) => {
  const [, { updateVideoSrc }] = RecordedEventSlice.useContext();

  return (
    <ContentMenu show={isShowing} styles={tw`absolute right-0 top-0`}>
      <UpdateVideoSrcButton_
        updateVideoSrc={(youtubeId) => updateVideoSrc({ youtubeId })}
      />
    </ContentMenu>
  );
};

export default Menu;
