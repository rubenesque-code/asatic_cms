import { useDispatch } from "^redux/hooks";
import { addOne as addLandingSection } from "^redux/state/landing";

import { useComponentContext } from "../Context";

import ContentMenu from "^components/menus/Content";
import {
  LandingAutoSectionIcon,
  LandingUserSectionIcon,
} from "^components/Icons";
import AutoSectionPopover from "./auto-section-popover";
import tw from "twin.macro";

function Panel() {
  return (
    <ContentMenu show={true} styles={tw`border-2`}>
      <CustomSectionButton />
      <AutoSectionPopover>
        <AutoSectionButton />
      </AutoSectionPopover>
    </ContentMenu>
  );
}

export default Panel;

const CustomSectionButton = () => {
  const { closePopover, newSectionIndex } = useComponentContext();

  const dispatch = useDispatch();

  const addUserCreatedSection = () => {
    dispatch(addLandingSection({ type: "custom", index: newSectionIndex }));
    closePopover();
  };

  return (
    <ContentMenu.Button
      onClick={addUserCreatedSection}
      tooltipProps={{
        text: {
          header: "user-created",
          body: "Add any type of document and edit its size.",
        },
        type: "action",
      }}
    >
      <LandingUserSectionIcon />
    </ContentMenu.Button>
  );
};

const AutoSectionButton = () => (
  <ContentMenu.Button
    tooltipProps={{
      text: {
        header: "auto-created",
        body: "Automatically created section from  existing documents",
      },
      type: "action",
    }}
  >
    <LandingAutoSectionIcon />
  </ContentMenu.Button>
);
